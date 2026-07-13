<template>
  <AppPage width="narrow">
    <AppPageTitle
      :eyebrow="lead ? 'Promoção de lead' : 'Control Plane'"
      :title="lead ? `Promover ${lead.nome}` : 'Provisionar Tenant'"
      :subtitle="lead ? 'Converte o lead em um Tenant ativo.' : 'Cria um novo Tenant (banco, RBAC, admin).'"
    >
      <template #actions>
        <q-btn flat no-caps icon="sym_o_arrow_back" label="Voltar" :to="{ name: 'tenants' }" />
      </template>
    </AppPageTitle>

    <!-- Formulário -->
    <q-form v-if="phase === 'form'" @submit.prevent="submit">
      <q-banner v-if="lead" class="promo-banner q-mb-md" rounded>
        <template #avatar><q-icon name="sym_o_swap_horiz" color="primary" /></template>
        Promovendo o lead <strong>{{ lead.nome }}</strong> ({{ lead.email }}). Ao concluir, o lead vira
        <strong>convertido</strong> e passa a apontar para o Tenant.
      </q-banner>

      <AppCard>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-8">
            <q-input v-model="form.name" outlined label="Nome do Tenant" :rules="[req]" @blur="suggestSlug" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.slug" outlined label="Subdomínio" :rules="[req]" hint="ex.: alfa">
              <template #append><span class="slug-suffix">.conectaceramica.com.br</span></template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input v-model="form.admin_name" outlined label="Nome do admin" :rules="[req]" />
          </div>
          <div class="col-12 col-sm-6">
            <q-input v-model="form.admin_email" type="email" outlined label="E-mail do admin" :rules="[req]" />
          </div>

          <div class="col-12 col-sm-6">
            <q-select
              v-model="form.plan_slug"
              outlined
              clearable
              emit-value
              map-options
              label="Plano"
              :options="planOptions"
              hint="Padrão: trial"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.admin_password"
              outlined
              label="Senha do admin (opcional)"
              hint="Em branco → gerada automaticamente"
            />
          </div>
        </div>
      </AppCard>

      <div class="row justify-end q-mt-md">
        <q-btn type="submit" color="primary" no-caps unelevated icon="sym_o_rocket_launch" label="Provisionar" :loading="submitting" />
      </div>
    </q-form>

    <!-- Acompanhamento (enfileirado + polling) -->
    <AppCard v-else-if="phase === 'provisioning'" class="text-center q-pa-lg">
      <q-spinner-gears color="primary" size="52px" />
      <h3 class="prov-title">Provisionando <strong>{{ form.slug }}</strong>…</h3>
      <p class="prov-sub">{{ runBadge(runStatus).label }} — criando banco, migrando e semeando (RBAC, admin).</p>
      <q-linear-progress indeterminate rounded color="primary" class="q-mt-md" />
    </AppCard>

    <!-- Concluído -->
    <AppCard v-else-if="phase === 'done'" class="q-pa-lg">
      <div class="text-center">
        <q-icon name="sym_o_check_circle" color="positive" size="52px" />
        <h3 class="prov-title">Tenant provisionado</h3>
      </div>
      <q-banner class="cred-banner q-mt-md" rounded>
        <template #avatar><q-icon name="sym_o_key" color="warning" /></template>
        Guarde estas credenciais — a senha é exibida <strong>uma única vez</strong>.
        <div class="cred-line q-mt-sm"><span>Admin</span><code>{{ result?.admin_email }}</code></div>
        <div class="cred-line"><span>Senha</span><code>{{ result?.admin_password }}</code></div>
      </q-banner>
      <div class="row justify-end q-gutter-sm q-mt-md">
        <q-btn flat no-caps label="Provisionar outro" @click="resetForm" />
        <q-btn color="primary" no-caps unelevated label="Ver Tenant" :to="{ name: 'tenant', params: { id: doneTenantId } }" />
      </div>
    </AppCard>

    <!-- Falha -->
    <AppCard v-else class="q-pa-lg">
      <div class="text-center">
        <q-icon name="sym_o_error" color="negative" size="52px" />
        <h3 class="prov-title">Falha no provisionamento</h3>
        <p class="prov-sub">{{ errorMsg }}</p>
      </div>
      <div class="row justify-end q-mt-md">
        <q-btn color="primary" no-caps unelevated label="Tentar novamente" @click="phase = 'form'" />
      </div>
    </AppCard>
  </AppPage>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { AppPage, AppPageTitle, AppCard } from '@/design-system';
import { tenantsService } from '@/services/tenants';
import { plansService } from '@/services/plans';
import { leadsService } from '@/services/leads';
import type { PlatformLead, ProvisionResult } from '@/types/admin';
import { runBadge } from '@/utils/adminStatus';
import { useNotify } from '@/composables/useNotify';
import { useRoute } from 'vue-router';

const route = useRoute();
const notify = useNotify();

const req = (v: string) => !!v || 'Campo obrigatório';

const form = reactive({
  name: '',
  slug: '',
  admin_name: '',
  admin_email: '',
  plan_slug: null as string | null,
  admin_password: '',
});

const planOptions = ref<{ label: string; value: string }[]>([]);
const lead = ref<PlatformLead | null>(null);
const leadId = route.query.lead ? Number(route.query.lead) : null;

type Phase = 'form' | 'provisioning' | 'done' | 'error';
const phase = ref<Phase>('form');
const submitting = ref(false);
const result = ref<ProvisionResult | null>(null);
const doneTenantId = ref<string | null>(null);
const runStatus = ref('pending');
const errorMsg = ref('');

let timer: ReturnType<typeof setTimeout> | null = null;
let attempts = 0;
const MAX_ATTEMPTS = 40; // ~80s

function suggestSlug() {
  if (form.slug) return;
  form.slug = form.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63);
}

async function submit() {
  submitting.value = true;
  try {
    const res = await tenantsService.provision({
      name: form.name,
      slug: form.slug,
      admin_name: form.admin_name,
      admin_email: form.admin_email,
      ...(form.plan_slug ? { plan_slug: form.plan_slug } : {}),
      ...(form.admin_password ? { admin_password: form.admin_password } : {}),
      ...(leadId ? { platform_lead_id: leadId } : {}),
    });
    result.value = res;
    phase.value = 'provisioning';
    attempts = 0;
    poll();
  } catch (e) {
    notify.error(e);
  } finally {
    submitting.value = false;
  }
}

function poll() {
  timer = setTimeout(async () => {
    attempts += 1;
    try {
      const status = await tenantsService.provisioningStatus(form.slug);
      runStatus.value = status.run?.status ?? 'pending';

      if (status.status === 'active' && status.tenant) {
        doneTenantId.value = status.tenant.id;
        phase.value = 'done';
        return;
      }
      if (status.status === 'failed') {
        errorMsg.value = status.run?.error ?? 'O provisionamento falhou.';
        phase.value = 'error';
        return;
      }
    } catch {
      /* mantém o polling — erro transitório */
    }

    if (attempts >= MAX_ATTEMPTS) {
      errorMsg.value = 'Tempo excedido aguardando o provisionamento. Verifique a lista de Tenants.';
      phase.value = 'error';
      return;
    }
    poll();
  }, 2000);
}

function resetForm() {
  form.name = '';
  form.slug = '';
  form.admin_name = '';
  form.admin_email = '';
  form.plan_slug = null;
  form.admin_password = '';
  result.value = null;
  doneTenantId.value = null;
  phase.value = 'form';
}

onMounted(async () => {
  try {
    const plans = await plansService.list();
    planOptions.value = plans.map((p) => ({ label: `${p.name} (${p.slug})`, value: p.slug }));
  } catch {
    /* planos são opcionais no formulário */
  }

  if (leadId) {
    try {
      const l = await leadsService.get(leadId);
      lead.value = l;
      form.name = l.empresa || l.nome;
      form.admin_name = l.nome;
      form.admin_email = l.email;
      if (l.plano_slug) form.plan_slug = l.plano_slug;
      suggestSlug();
    } catch (e) {
      notify.error(e, 'Não foi possível carregar o lead.');
    }
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.promo-banner { background: var(--brand-050); color: var(--ink); }
.cred-banner { background: var(--surface-2); border: 1px solid var(--border); }
.cred-line { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.cred-line span { width: 54px; color: var(--ink-2); }
.cred-line code { background: var(--surface-3); padding: 2px 8px; border-radius: 6px; font-weight: 600; }
.slug-suffix { font-size: 11px; color: var(--ink-3); }
.prov-title { font-family: var(--font-brand); font-weight: 700; margin: 14px 0 4px; color: var(--ink); }
.prov-sub { color: var(--ink-2); margin: 0; }
</style>
