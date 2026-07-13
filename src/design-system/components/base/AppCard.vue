<template>
  <component :is="tag" class="app-card" :class="{ 'app-card--hover': hover, 'app-card--flat': flat }">
    <slot />
  </component>
</template>

<script setup lang="ts">
/** AppCard — superfície padrão (Camada 1, ADR-015). Substitui .dash-card espalhado. */
withDefaults(defineProps<{ hover?: boolean; flat?: boolean; tag?: string }>(), {
  hover: false, flat: false, tag: 'div',
});
</script>

<style scoped>
.app-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-1);
  transition: box-shadow var(--dur-slow) var(--ease), transform var(--dur-slow) var(--ease), border-color var(--dur-slow) var(--ease);
}
.app-card--flat { box-shadow: none; }
.app-card--hover:hover {
  box-shadow: var(--shadow-2);
  transform: translateY(-2px);
  border-color: var(--border-strong);
}
</style>
