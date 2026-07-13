<template>
  <AppCard hover class="app-metric">
    <div class="app-metric__row">
      <div class="app-metric__icon" :style="{ background: bg, color: fg }">
        <q-icon :name="icon" size="22px" />
      </div>
      <div class="app-metric__body">
        <div class="app-metric__label">{{ label }}</div>
        <div class="app-metric__value">
          <span v-if="!loading">{{ value }}</span>
          <q-skeleton v-else type="text" width="64px" />
        </div>
        <div v-if="delta !== undefined && !loading" class="app-metric__delta" :class="deltaClass">
          <q-icon :name="delta >= 0 ? 'sym_o_trending_up' : 'sym_o_trending_down'" size="14px" />
          {{ deltaLabel }}
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
/** AppMetricCard — KPI de valor (Camada 1). Cor por `tone` do DS (tokens), nunca hex (ADR-015). Suporta Δ. */
import { computed } from 'vue';
import AppCard from './AppCard.vue';
import type { StatusTone } from '@/design-system/tokens';

const props = withDefaults(defineProps<{
  label: string; value?: string | number; icon: string; tone?: StatusTone;
  loading?: boolean; delta?: number; deltaSuffix?: string;
}>(), { tone: 'orange', value: '—', deltaSuffix: '%' });

const fg = computed(() => `var(--tone-${props.tone}-fg)`);
const bg = computed(() => `var(--tone-${props.tone}-bg)`);
const deltaClass = computed(() => (props.delta ?? 0) >= 0 ? 'is-up' : 'is-down');
const deltaLabel = computed(() => {
  const d = props.delta ?? 0;
  return `${d >= 0 ? '+' : ''}${d}${props.deltaSuffix} vs. mês anterior`;
});
</script>

<style scoped>
.app-metric { padding: var(--space-4); }
.app-metric__row { display: flex; align-items: center; gap: var(--space-4); }
.app-metric__icon { width: 46px; height: 46px; border-radius: var(--radius-md); display: grid; place-items: center; flex: none; }
.app-metric__body { min-width: 0; }
.app-metric__label { font-size: var(--text-xs); color: var(--ink-2); font-weight: var(--fw-medium); }
.app-metric__value { font-family: var(--font-brand); font-size: var(--text-2xl); font-weight: var(--fw-bold); color: var(--ink); line-height: 1.2; margin-top: 2px; font-variant-numeric: tabular-nums; }
.app-metric__delta { display: inline-flex; align-items: center; gap: 3px; font-size: var(--text-2xs); font-weight: var(--fw-semibold); margin-top: 3px; }
.app-metric__delta.is-up { color: var(--success); }
.app-metric__delta.is-down { color: var(--danger); }
</style>
