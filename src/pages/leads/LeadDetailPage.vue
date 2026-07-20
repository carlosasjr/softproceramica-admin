<template>
  <AppPage width="default">
    <AppPageTitle eyebrow="Lead de Plataforma" :title="lead?.name ?? '—'" :subtitle="lead?.company ?? ''">
      <template #actions>
        <q-btn flat no-caps icon="sym_o_arrow_back" label="Voltar" :to="{ name: 'leads' }" />
        <q-btn
          v-if="lead && lead.status !== 'converted'"
          color="primary"
          no-caps
          unelevated
          icon="sym_o_swap_horiz"
          label="Promover a Tenant"
          :to="{ name: 'tenant-novo', query: { lead: lead.id } }"
        />
      </template>
    </AppPageTitle>

    <AppLoading v-if="loading" />

    <template v-else-if="lead">
      <q-banner v-if="lead.status === 'converted'" class="conv-banner q-mb-md" rounded>
        <template #avatar><q-icon name="sym_o_check_circle" color="positive" /></template>
        Convertido em {{ fmt.date(lead.converted_at) }}.
        <q-btn
          v-if="lead.tenant_id"
          flat
          dense
          no-caps
          label="Ver Tenant"
          color="primary"
          :to="{ name: 'tenant', params: { id: lead.tenant_id } }"
        />
      </q-banner>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-7">
          <AppCard>
            <div class="card-label">Contato</div>
            <div class="detail-row"><span>E-mail</span><b>{{ lead.email }}</b></div>
            <div class="detail-row"><span>Telefone</span>{{ fmt.phone(lead.phone) }}</div>
            <div class="detail-row"><span>Cidade/UF</span>{{ [lead.city, lead.state].filter(Boolean).join(' / ') || '—' }}</div>
            <div class="detail-row"><span>Segmento</span>{{ lead.segment ?? '—' }}</div>
            <div class="detail-row"><span>Porte</span>{{ lead.company_size ?? '—' }}</div>
            <div class="detail-row"><span>Plano de interesse</span>{{ lead.plan_slug ?? '—' }}</div>
            <template v-if="lead.message">
              <q-separator class="q-my-sm" />
              <div class="card-label">Mensagem</div>
              <p class="lead-msg">{{ lead.message }}</p>
            </template>
          </AppCard>
        </div>

        <div class="col-12 col-md-5">
          <AppCard>
            <div class="card-label">Triagem</div>
            <div class="detail-row"><span>Status</span><AppStatus :label="leadBadge(lead.status).label" :tone="leadBadge(lead.status).tone" /></div>
            <q-select
              v-if="lead.status !== 'converted'"
              v-model="newStatus"
              outlined
              dense
              emit-value
              map-options
              class="q-mt-sm"
              label="Alterar status"
              :options="LEAD_TRIAGE_OPTIONS"
              :loading="saving"
              @update:model-value="changeStatus"
            />
          </AppCard>

          <AppCard class="q-mt-md">
            <div class="card-label">Atribuição</div>
            <div class="detail-row"><span>Origem</span>{{ lead.source ?? '—' }}</div>
            <div class="detail-row"><span>Captado em</span>{{ fmt.dateTime(lead.created_at) }}</div>
            <template v-if="attributionEntries.length">
              <q-separator class="q-my-sm" />
              <div v-for="[k, v] in attributionEntries" :key="k" class="detail-row"><span>{{ k }}</span>{{ v }}</div>
            </template>
          </AppCard>
        </div>
      </div>
    </template>

    <AppEmptyState v-else icon="sym_o_error" title="Lead não encontrado" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AppPage, AppPageTitle, AppCard, AppStatus, AppLoading, AppEmptyState } from '@/design-system';
import { leadsService } from '@/services/leads';
import type { LeadStatus, PlatformLead } from '@/types/admin';
import { leadBadge, LEAD_TRIAGE_OPTIONS } from '@/utils/adminStatus';
import { useFormat } from '@/composables/useFormat';
import { useNotify } from '@/composables/useNotify';

const props = defineProps<{ id: string }>();
const fmt = useFormat();
const notify = useNotify();

const lead = ref<PlatformLead | null>(null);
const loading = ref(true);
const saving = ref(false);
const newStatus = ref<LeadStatus | null>(null);

const attributionEntries = computed(() => Object.entries(lead.value?.attribution ?? {}));

async function changeStatus(status: LeadStatus) {
  if (!lead.value) return;
  saving.value = true;
  try {
    lead.value = await leadsService.updateStatus(lead.value.id, status);
    notify.success('Status atualizado.');
  } catch (e) {
    notify.error(e);
  } finally {
    saving.value = false;
    newStatus.value = null;
  }
}

onMounted(async () => {
  try {
    lead.value = await leadsService.get(props.id);
  } catch (e) {
    notify.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.conv-banner { background: var(--tone-green-bg); color: var(--tone-green-fg); }
.card-label { font-weight: 600; color: var(--ink); margin-bottom: 8px; }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 0; font-size: 14px; }
.detail-row span { color: var(--ink-2); }
.lead-msg { color: var(--ink); font-size: 14px; margin: 4px 0 0; white-space: pre-wrap; }
</style>
