<template>
  <div class="app-filter-bar">
    <slot />
  </div>
</template>

<script setup lang="ts">
/** AppFilterBar — barra de filtros/ações acima de listas (Camada 2, ADR-015). Compõe AppChip/AppSearch. */
</script>

<style scoped>
.app-filter-bar {
  display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
}
</style>
