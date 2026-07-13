<template>
  <div class="app-timeline">
    <!-- Carregamento inicial -->
    <AppSkeleton v-if="loading" variant="list" :lines="4" />

    <!-- Vazio -->
    <AppEmptyState v-else-if="!events.length" icon="sym_o_history" title="Sem histórico ainda"
                   :message="emptyMessage" />

    <!-- Feed agrupado por data -->
    <q-infinite-scroll v-else :offset="220" :disable="!hasMore" @load="onLoad">
      <div v-for="group in groups" :key="group.key" class="app-timeline__group">
        <div class="app-timeline__day">
          <span class="app-timeline__day-label">{{ group.label }}</span>
          <span class="app-timeline__day-line" />
        </div>
        <AppTimelineItem
          v-for="ev in group.items"
          :key="ev.id"
          :event="ev"
          :icon="iconFor(ev.type)"
          :important="isImportant(ev.type)"
          :time="timeFor(ev.occurred_at)"
        />
      </div>

      <template #loading>
        <div class="app-timeline__more"><q-spinner-dots color="primary" size="30px" /></div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
/**
 * AppTimeline — feed do "Git do Cliente" (Camada 2, ADR-013/015).
 * Presentacional: recebe eventos já carregados, agrupa por data e pede mais
 * via @load-more. Reutilizável (futura Central de Atendimento).
 */
import { computed } from 'vue';
import AppTimelineItem from './AppTimelineItem.vue';
import AppSkeleton from '../base/AppSkeleton.vue';
import AppEmptyState from '../base/AppEmptyState.vue';
import { timelineIcon } from '@/utils/labels';
import type { TimelineEvent } from '@/types/models';

const props = withDefaults(defineProps<{
  events: TimelineEvent[];
  loading?: boolean;
  hasMore?: boolean;
  emptyMessage?: string;
}>(), { emptyMessage: 'As interações do cliente aparecerão aqui automaticamente.' });

const emit = defineEmits<{ 'load-more': [done: () => void] }>();

/** Eventos de marco — destacados no feed. */
const IMPORTANT = new Set([
  'oportunidade_ganha', 'oportunidade_perdida', 'proposta_enviada', 'proposta',
  'pedido_criado', 'nps_respondido', 'mudanca_etapa',
]);
function isImportant(type: string) { return IMPORTANT.has(type); }
function iconFor(type: string) { return timelineIcon[type] ?? 'sym_o_bookmark'; }

function onLoad(_index: number, done: () => void) { emit('load-more', done); }

// ---- Agrupamento por data ----
const dayFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

function groupLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const today = startOfDay(new Date());
  const day = startOfDay(d);
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return 'Esta semana';
  return dayFmt.format(d);
}

function timeFor(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : timeFmt.format(d);
}

const groups = computed(() => {
  const out: { key: string; label: string; items: TimelineEvent[] }[] = [];
  for (const ev of props.events) {
    const label = groupLabel(ev.occurred_at);
    let g = out[out.length - 1];
    if (!g || g.label !== label) { g = { key: label + '-' + ev.id, label, items: [] }; out.push(g); }
    g.items.push(ev);
  }
  return out;
});
</script>

<style scoped>
.app-timeline__group { margin-bottom: var(--space-2); }
.app-timeline__day { display: flex; align-items: center; gap: var(--space-3); margin: var(--space-2) 0 var(--space-4); }
.app-timeline__day-label {
  font-size: var(--text-2xs); font-weight: var(--fw-bold); letter-spacing: var(--tracking-wide);
  text-transform: uppercase; color: var(--ink-3); background: var(--surface-2);
  padding: 4px 10px; border-radius: var(--radius-pill); white-space: nowrap;
}
.app-timeline__day-line { flex: 1; height: 1px; background: var(--border); }
.app-timeline__more { display: flex; justify-content: center; padding: var(--space-4); }
</style>
