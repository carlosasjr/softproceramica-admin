<template>
  <q-input
    :model-value="text"
    outlined
    :dense="dense"
    :label="label"
    :readonly="readonly"
    :disable="disable"
    prefix="R$"
    inputmode="numeric"
    class="app-money"
    @update:model-value="onInput"
  >
    <template v-if="$slots.append" #append><slot name="append" /></template>
    <template v-if="$slots.hint" #hint><slot name="hint" /></template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * AppMoneyInput — campo monetário padrão em BRL (Camada 1, ADR-015).
 * Quasar-first: compõe `q-input`. Digitação por centavos (padrão bancário BR):
 * o usuário digita os dígitos e o valor se forma da direita para a esquerda
 * (ex.: "8990" → R$ 89,90). O `v-model` é sempre um **número** (ou `null` quando vazio),
 * pronto para enviar ao backend (`numeric`). A exibição usa separadores pt-BR.
 */
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: number | null | undefined;
    label?: string;
    dense?: boolean;
    readonly?: boolean;
    disable?: boolean;
  }>(),
  { dense: false, readonly: false, disable: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>();

const nf = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function fmt(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '';
  return nf.format(v);
}

// Texto exibido mantido em estado local (não computed): garante reformatação mesmo quando a
// digitação resolve para o MESMO número do modelo (senão o q-input ficaria com o texto cru).
const text = ref(fmt(props.modelValue));
watch(
  () => props.modelValue,
  (v) => { const f = fmt(v); if (f !== text.value) text.value = f; },
);

function onInput(val: string | number | null) {
  const digits = String(val ?? '').replace(/\D/g, '');
  if (!digits) { text.value = ''; emit('update:modelValue', null); return; }
  // Interpreta os dígitos como centavos (evita erros de ponto flutuante na formatação).
  const num = Number(digits) / 100;
  text.value = fmt(num); // reformatta sempre, independente de o número ter mudado
  emit('update:modelValue', num);
}
</script>

<style scoped>
.app-money :deep(input) { text-align: right; font-variant-numeric: tabular-nums; }
</style>
