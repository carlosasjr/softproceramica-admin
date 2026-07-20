<template>
  <AppPage width="wide">
    <AppPageTitle eyebrow="Control Plane" title="Tenants" subtitle="Empresas provisionadas na plataforma.">
      <template #actions>
        <q-btn color="primary" no-caps unelevated icon="sym_o_add" label="Novo Tenant" :to="{ name: 'tenant-new' }" />
      </template>
    </AppPageTitle>

    <AppCard>
      <div class="row q-col-gutter-md q-mb-md items-center">
        <div class="col-12 col-sm-7">
          <q-input
            v-model="search"
            outlined
            dense
            debounce="350"
            placeholder="Buscar por nome ou subdomínio…"
            clearable
            @update:model-value="reload"
          >
            <template #prepend><q-icon name="sym_o_search" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-5">
          <q-select
            v-model="statusFilter"
            outlined
            dense
            emit-value
            map-options
            clearable
            label="Status"
            :options="statusOptions"
            @update:model-value="reload"
          />
        </div>
      </div>

      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        @request="onRequest"
        @row-click="(_e, row) => open(row)"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="tenant-name">{{ props.row.name }}</div>
            <div class="tenant-slug">{{ props.row.slug }}.conectaceramica.com.br</div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <AppStatus :label="tenantBadge(props.row.status).label" :tone="tenantBadge(props.row.status).tone" />
          </q-td>
        </template>

        <template #body-cell-plan="props">
          <q-td :props="props">{{ props.row.plan?.name ?? '—' }}</q-td>
        </template>

        <template #body-cell-created_at="props">
          <q-td :props="props">{{ fmt.date(props.row.created_at) }}</q-td>
        </template>

        <template #no-data>
          <AppEmptyState
            icon="sym_o_domain"
            title="Nenhum Tenant"
            description="Provisione o primeiro Tenant ou promova um lead de plataforma."
          />
        </template>
      </q-table>
    </AppCard>
  </AppPage>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { QTableColumn } from 'quasar';
import { AppPage, AppPageTitle, AppCard, AppStatus, AppEmptyState } from '@/design-system';
import { tenantsService } from '@/services/tenants';
import type { Tenant } from '@/types/admin';
import { tenantBadge } from '@/utils/adminStatus';
import { useFormat } from '@/composables/useFormat';
import { useNotify } from '@/composables/useNotify';

const router = useRouter();
const fmt = useFormat();
const notify = useNotify();

const rows = ref<Tenant[]>([]);
const loading = ref(false);
const search = ref('');
const statusFilter = ref<string | null>(null);
const pagination = ref({ page: 1, rowsPerPage: 0, rowsNumber: 0 });

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Provisionando', value: 'provisioning' },
  { label: 'Suspenso', value: 'suspended' },
  { label: 'Falhou', value: 'failed' },
];

const columns: QTableColumn[] = [
  { name: 'name', label: 'Tenant', field: 'name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'plan', label: 'Plano', field: 'plan', align: 'left' },
  { name: 'created_at', label: 'Criado em', field: 'created_at', align: 'left' },
];

async function fetchPage(page: number) {
  loading.value = true;
  try {
    const res = await tenantsService.list({
      page,
      ...(search.value ? { search: search.value } : {}),
      ...(statusFilter.value ? { status: statusFilter.value } : {}),
    });
    rows.value = res.data;
    pagination.value.page = res.meta?.current_page ?? 1;
    pagination.value.rowsNumber = res.meta?.total ?? res.data.length;
  } catch (e) {
    notify.error(e);
  } finally {
    loading.value = false;
  }
}

function onRequest(props: { pagination: { page: number } }) {
  void fetchPage(props.pagination.page);
}

function reload() {
  void fetchPage(1);
}

function open(row: Tenant) {
  void router.push({ name: 'tenant', params: { id: row.id } });
}

onMounted(() => fetchPage(1));
</script>

<style scoped>
.tenant-name { font-weight: 600; color: var(--ink); }
.tenant-slug { font-size: 12px; color: var(--ink-3); }
</style>
