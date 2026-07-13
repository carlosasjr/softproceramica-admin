<template>
  <q-page class="app-page" :class="`app-page--${width}`">
    <div class="app-page__inner">
      <slot />
    </div>
  </q-page>
</template>

<script setup lang="ts">
/**
 * AppPage — casca padrão de página (Camada 1, ADR-015). Resolve T1/T2:
 * centraliza largura máxima e o padding em um único lugar.
 */
withDefaults(defineProps<{ width?: 'narrow' | 'default' | 'wide' | 'full' }>(), {
  width: 'default',
});
</script>

<style scoped>
.app-page { padding: var(--space-6); }
.app-page__inner { margin: 0 auto; }
.app-page--narrow  .app-page__inner { max-width: var(--page-narrow); }
.app-page--default .app-page__inner { max-width: var(--page-default); }
.app-page--wide    .app-page__inner { max-width: var(--page-wide); }
.app-page--full    .app-page__inner { max-width: none; }

@media (max-width: 599px) {
  .app-page { padding: var(--space-4); }
}
</style>
