<template>
  <div class="app-loading" :class="{ 'app-loading--inline': inline }">
    <q-spinner-dots color="primary" :size="inline ? '28px' : '38px'" />
    <span v-if="label" class="app-loading__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
/** AppLoading — indicador de carregamento leve (Camada 1 · Product Polish). */
defineProps<{ label?: string; inline?: boolean }>();
</script>

<style scoped>
.app-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-3); padding: var(--space-8); }
.app-loading--inline { flex-direction: row; padding: var(--space-4); }
.app-loading__label { color: var(--ink-3); font-size: var(--text-sm); }
</style>
