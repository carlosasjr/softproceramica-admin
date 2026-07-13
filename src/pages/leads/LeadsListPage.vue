<template>
  <AppPage width="wide">
    <AppPageTitle
      eyebrow="Control Plane"
      title="Leads de Plataforma"
      subtitle="Prospects captados pela Landing Institucional."
    />

    <AppCard>
      <div class="row q-col-gutter-md q-mb-md items-center">
        <div class="col-12 col-sm-7">
          <q-input
            v-model="search"
            outlined
            dense
            debounce="350"
            placeholder="Buscar por nome, empresa ou e-mail…"
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
        <template #body-cell-nome="props">
          <q-td :props="props">
            <div class="lead-name">{{ props.row.nome }}</div>
            <div class="lead-sub">{{ props.row.empresa || props.row.email }}</div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <AppStatus :label="leadBadge(props.row.status).label" :tone="leadBadge(props.row.status).tone" />
          </q-td>
        </template>

        <template #body-cell-segmento="props">
          <q-td :props="props">{{ props.row.segmento ?? '—' }}</q-td>
        </template>

        <template #body-cell-origem="props">
          <q-td :props="props">{{ props.row.origem ?? '—' }}</q-td>
        </template>

        <template #body-cell-created_at="props">
          <q-td :props="props">{{ fmt.date(props.row.created_at) }}</q-td>
        </template>

        <template #no-data>
          <AppEmptyState icon="sym_o_contact_mail" title="Nenhum lead" description="Ainda não há prospects captados." />
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
import { leadsService } from '@/services/leads';
import type { PlatformLead } from '@/types/admin';
import { leadBadge } from '@/utils/adminStatus';
import { useFormat } from '@/composables/useFormat';
import { useNotify } from '@/composables/useNotify';

const router = useRouter();
const fmt = useFormat();
const notify = useNotify();

const rows = ref<PlatformLead[]>([]);
const loading = ref(false);
const search = ref('');
const statusFilter = ref<string | null>(null);
const pagination = ref({ page: 1, rowsPerPage: 0, rowsNumber: 0 });

const statusOptions = [
  { label: 'Novo', value: 'novo' },
  { label: 'Em contato', value: 'em_contato' },
  { label: 'Qualificado', value: 'qualificado' },
  { label: 'Convertido', value: 'convertido' },
  { label: 'Descartado', value: 'descartado' },
];

const columns: QTableColumn[] = [
  { name: 'nome', label: 'Lead', field: 'nome', align: 'left' },
  { name: 'segmento', label: 'Segmento', field: 'segmento', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'origem', label: 'Origem', field: 'origem', align: 'left' },
  { name: 'created_at', label: 'Captado em', field: 'created_at', align: 'left' },
];

async function fetchPage(page: number) {
  loading.value = true;
  try {
    const res = await leadsService.list({
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

function open(row: PlatformLead) {
  void router.push({ name: 'lead', params: { id: row.id } });
}

onMounted(() => fetchPage(1));
</script>

<style scoped>
.lead-name { font-weight: 600; color: var(--ink); }
.lead-sub { font-size: 12px; color: var(--ink-3); }
</style>
