<template>
  <q-input
    :model-value="modelValue"
    outlined dense clearable
    :debounce="debounce"
    :placeholder="placeholder"
    class="app-search"
    @update:model-value="$emit('update:modelValue', ($event as string) ?? '')"
  >
    <template #prepend><q-icon name="sym_o_search" /></template>
  </q-input>
</template>

<script setup lang="ts">
/** AppSearch — campo de busca padrão (Camada 2, ADR-015). */
withDefaults(defineProps<{ modelValue: string; placeholder?: string; debounce?: string | number }>(), {
  placeholder: 'Buscar…', debounce: 400,
});
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<style scoped>
.app-search { min-width: 220px; }
</style>
