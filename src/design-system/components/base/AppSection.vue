<template>
  <section class="app-section">
    <header v-if="title || $slots.actions" class="app-section__head">
      <div>
        <div class="app-section__title">{{ title }}</div>
        <div v-if="hint" class="app-section__hint">{{ hint }}</div>
      </div>
      <div v-if="$slots.actions" class="app-section__actions"><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
/** AppSection — bloco de seção com título (Camada 1). */
defineProps<{ title?: string; hint?: string }>();
</script>

<style scoped>
.app-section__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: var(--space-3); }
.app-section__title { font-family: var(--font-brand); font-weight: var(--fw-semibold); font-size: var(--text-base); color: var(--ink); }
.app-section__hint { font-size: var(--text-xs); color: var(--ink-3); margin-top: 2px; }
.app-section__actions { display: flex; align-items: center; gap: var(--space-2); }
</style>
