<template>
  <AppPage width="default">
    <AppPageTitle eyebrow="Tenant" :title="tenant?.name ?? '—'" :subtitle="tenant ? `${tenant.slug}.conectaceramica.com.br` : ''">
      <template #actions>
        <q-btn flat no-caps icon="sym_o_arrow_back" label="Voltar" :to="{ name: 'tenants' }" />
      </template>
    </AppPageTitle>

    <AppLoading v-if="loading" />

    <template v-else-if="tenant">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-7">
          <AppCard>
            <div class="detail-row"><span>Status</span><AppStatus :label="tenantBadge(tenant.status).label" :tone="tenantBadge(tenant.status).tone" /></div>
            <q-separator class="q-my-sm" />
            <div class="detail-row"><span>Subdomínio</span><code>{{ tenant.slug }}</code></div>
            <div class="detail-row"><span>Plano</span><b>{{ tenant.plan?.name ?? '—' }}</b></div>
            <div class="detail-row"><span>ID</span><code class="tenant-id">{{ tenant.id }}</code></div>
            <div class="detail-row"><span>Criado em</span>{{ fmt.dateTime(tenant.created_at) }}</div>
          </AppCard>
        </div>

        <div class="col-12 col-md-5">
          <AppCard>
            <div class="card-label">Provisionamento</div>
            <template v-if="run">
              <div class="detail-row"><span>Etapa</span><AppStatus :label="runBadge(run.status).label" :tone="runBadge(run.status).tone" /></div>
              <div class="detail-row"><span>Passo</span>{{ run.step ?? '—' }}</div>
              <div v-if="run.error" class="run-error">{{ run.error }}</div>
              <div class="detail-row"><span>Atualizado</span>{{ fmt.dateTime(run.updated_at) }}</div>
            </template>
            <div v-else class="text-ink-3">Sem run registrado.</div>
          </AppCard>
        </div>
      </div>
    </template>

    <AppEmptyState v-else icon="sym_o_error" title="Tenant não encontrado" />
  </AppPage>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppPage, AppPageTitle, AppCard, AppStatus, AppLoading, AppEmptyState } from '@/design-system';
import { tenantsService } from '@/services/tenants';
import type { ProvisioningRun, Tenant } from '@/types/admin';
import { tenantBadge, runBadge } from '@/utils/adminStatus';
import { useFormat } from '@/composables/useFormat';
import { useNotify } from '@/composables/useNotify';

const props = defineProps<{ id: string }>();
const fmt = useFormat();
const notify = useNotify();

const tenant = ref<Tenant | null>(null);
const run = ref<ProvisioningRun | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { tenant: t, provisioning } = await tenantsService.get(props.id);
    tenant.value = t;
    run.value = provisioning;
  } catch (e) {
    notify.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 7px 0; font-size: 14px; }
.detail-row span { color: var(--ink-2); }
.detail-row code { background: var(--surface-3); padding: 2px 8px; border-radius: 6px; }
.tenant-id { font-size: 11px; }
.card-label { font-weight: 600; color: var(--ink); margin-bottom: 8px; }
.run-error { background: var(--tone-red-bg); color: var(--tone-red-fg); padding: 8px 10px; border-radius: 8px; font-size: 12.5px; margin: 6px 0; }
</style>
