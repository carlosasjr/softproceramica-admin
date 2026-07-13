<template>
  <button type="button" class="app-chip" :class="{ 'app-chip--active': active }" @click="$emit('click')">
    <q-icon v-if="icon" :name="icon" size="15px" />
    <slot>{{ label }}</slot>
    <q-icon v-if="removable" name="sym_o_close" size="14px" class="app-chip__x" @click.stop="$emit('remove')" />
  </button>
</template>

<script setup lang="ts">
/** AppChip — filtro/etiqueta interativa (Camada 1). */
defineProps<{ label?: string; icon?: string; active?: boolean; removable?: boolean }>();
defineEmits<{ click: []; remove: [] }>();
</script>

<style scoped>
.app-chip {
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  font-size: var(--text-sm); font-weight: var(--fw-medium); color: var(--ink-2);
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-pill);
  padding: 5px 12px; transition: all var(--dur-base) var(--ease);
}
.app-chip:hover { border-color: var(--border-strong); color: var(--ink); }
.app-chip--active { background: var(--brand-050); border-color: var(--brand); color: var(--brand-600); font-weight: var(--fw-semibold); }
.app-chip__x { opacity: .6; } .app-chip__x:hover { opacity: 1; }
</style>
