<template>
  <span class="app-badge" :class="{ 'app-badge--soft': soft }">
    <slot>{{ value }}</slot>
  </span>
</template>

<script setup lang="ts">
/** AppBadge — contador/rótulo compacto (Camada 1). Papel distinto de AppStatus (semântico) e AppChip (com ícone/ação). */
withDefaults(defineProps<{ value?: string | number; soft?: boolean }>(), { soft: true });
</script>

<style scoped>
.app-badge {
  display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px;
  padding: 0 7px; border-radius: var(--radius-pill); font-size: var(--text-2xs); font-weight: var(--fw-bold);
  font-variant-numeric: tabular-nums; background: var(--surface-3); color: var(--ink-2);
}
.app-badge--soft { background: var(--brand-050); color: var(--brand-600); }
</style>
