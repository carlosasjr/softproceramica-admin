<template>
  <q-dialog :model-value="modelValue" :persistent="persistent" @update:model-value="$emit('update:modelValue', $event)">
    <AppCard class="app-dialog" :style="{ minWidth: minWidth }">
      <div v-if="title" class="app-dialog__head">
        <div class="app-dialog__title font-brand">{{ title }}</div>
        <q-btn flat round dense icon="sym_o_close" size="12px" color="grey-7" v-close-popup />
      </div>
      <div class="app-dialog__body"><slot /></div>
      <div v-if="$slots.actions" class="app-dialog__foot"><slot name="actions" /></div>
    </AppCard>
  </q-dialog>
</template>

<script setup lang="ts">
/** AppDialog — modal padrão (Camada 2, ADR-015). Resolve T6: dialogs sem estilo inline repetido. */
import AppCard from '../base/AppCard.vue';
withDefaults(defineProps<{ modelValue: boolean; title?: string; persistent?: boolean; minWidth?: string }>(), {
  minWidth: '420px',
});
defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<style scoped>
.app-dialog { max-width: 96vw; overflow: hidden; }
.app-dialog__head { display: flex; align-items: center; justify-content: space-between; padding: var(--space-5) var(--space-5) var(--space-2); }
.app-dialog__title { font-size: var(--text-lg); font-weight: var(--fw-bold); color: var(--ink); }
.app-dialog__body { padding: var(--space-2) var(--space-5) var(--space-5); }
.app-dialog__foot { display: flex; align-items: center; justify-content: flex-end; gap: var(--space-2); padding: var(--space-3) var(--space-5); border-top: 1px solid var(--border); }
@media (max-width: 599px) { .app-dialog { min-width: 90vw !important; } }
</style>
