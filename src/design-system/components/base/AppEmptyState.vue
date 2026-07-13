<template>
  <div class="app-empty column flex-center text-center">
    <div class="app-empty__icon"><q-icon :name="icon" size="34px" /></div>
    <div class="app-empty__title">{{ title }}</div>
    <div v-if="message" class="app-empty__msg">{{ message }}</div>
    <div v-if="$slots.action" class="app-empty__action"><slot name="action" /></div>
  </div>
</template>

<script setup lang="ts">
/** AppEmptyState — estado vazio padrão (Camada 1). Sucede EmptyState. */
withDefaults(defineProps<{ icon?: string; title: string; message?: string }>(), {
  icon: 'sym_o_inbox',
});
</script>

<style scoped>
.app-empty { min-height: 240px; padding: var(--space-10) var(--space-6); }
.app-empty__icon {
  width: 68px; height: 68px; border-radius: var(--radius-xl); display: grid; place-items: center;
  background: var(--brand-050); color: var(--brand); margin-bottom: var(--space-4);
}
.app-empty__title { font-family: var(--font-brand); font-weight: var(--fw-semibold); font-size: var(--text-lg); color: var(--ink); }
.app-empty__msg { color: var(--ink-2); font-size: var(--text-sm); margin-top: var(--space-1); max-width: 40ch; }
.app-empty__action { margin-top: var(--space-4); }
</style>
