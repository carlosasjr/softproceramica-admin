<template>
  <div class="app-page-title">
    <div class="app-page-title__main">
      <div v-if="eyebrow" class="app-page-title__eyebrow">{{ eyebrow }}</div>
      <h1 class="app-page-title__title">{{ title }}</h1>
      <div v-if="subtitle" class="app-page-title__subtitle">{{ subtitle }}</div>
    </div>
    <div v-if="$slots.actions" class="app-page-title__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
/** AppPageTitle — cabeçalho de página (Camada 1). Sucede PageHeader. */
defineProps<{ title: string; subtitle?: string; eyebrow?: string }>();
</script>

<style scoped>
.app-page-title {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-6);
}
.app-page-title__eyebrow {
  font-size: var(--text-xs); font-weight: var(--fw-semibold); letter-spacing: var(--tracking-caps);
  text-transform: uppercase; color: var(--brand-600);
}
.app-page-title__title {
  font-family: var(--font-brand); font-weight: var(--fw-bold); font-size: var(--text-3xl);
  line-height: var(--lh-tight); margin: 2px 0 0; color: var(--ink); letter-spacing: var(--tracking-tight);
  text-wrap: balance;
}
.app-page-title__subtitle { color: var(--ink-2); margin-top: var(--space-1); font-size: var(--text-md); }
.app-page-title__actions { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }

@media (max-width: 599px) {
  .app-page-title__title { font-size: var(--text-2xl); }
  .app-page-title__actions { width: 100%; }
}
</style>
