<template>
  <q-input
    v-model="text"
    outlined
    :dense="dense"
    :label="label"
    :readonly="readonly"
    :disable="disable"
    :mask="mask"
    fill-mask
    :placeholder="placeholder"
    class="app-date"
    @update:model-value="onType"
  >
    <template #append>
      <q-icon v-if="!readonly && !disable" name="sym_o_event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <div class="app-date__popup">
            <q-date :model-value="dateIso" mask="YYYY-MM-DD" today-btn minimal color="primary" @update:model-value="onPickDate" />
            <q-time v-if="withTime" :model-value="timeVal" mask="HH:mm" format24h color="primary" @update:model-value="onPickTime" />
          </div>
          <div class="row justify-end q-pa-sm">
            <q-btn v-close-popup flat no-caps color="primary" label="Fechar" />
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template v-if="$slots.hint" #hint><slot name="hint" /></template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * AppDateInput — campo de data/hora padrão em formato brasileiro (Camada 1, ADR-015).
 * Quasar-first: `q-input` mascarado (dd/mm/aaaa[ hh:mm]) + `q-date`/`q-time` em popup.
 * O `v-model` é sempre uma **string ISO** (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm`), pronta para
 * o backend — drop-in para `type="date"` / `type="datetime-local"`.
 */
import { ref, computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined;
    label?: string;
    dense?: boolean;
    readonly?: boolean;
    disable?: boolean;
    /** Inclui hora (dd/mm/aaaa hh:mm ↔ YYYY-MM-DDTHH:mm). */
    withTime?: boolean;
  }>(),
  { dense: false, readonly: false, disable: false, withTime: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>();

const mask = computed(() => (props.withTime ? '##/##/#### ##:##' : '##/##/####'));
const placeholder = computed(() => (props.withTime ? 'dd/mm/aaaa hh:mm' : 'dd/mm/aaaa'));

function isoToDisplay(iso: string | null | undefined): string {
  if (!iso) return '';
  const [datePart, timePart] = iso.split('T');
  const [y, mo, da] = (datePart ?? '').split('-');
  if (!y || !mo || !da) return '';
  let out = `${da}/${mo}/${y}`;
  if (props.withTime) out += ` ${(timePart ?? '00:00').slice(0, 5)}`;
  return out;
}

function displayToIso(str: string): string | null {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!m) return null;
  const [, da, mo, y, hh, mi] = m;
  const day = Number(da), month = Number(mo), year = Number(y);
  // Valida data real (rejeita 31/02, 30/02, etc.) via round-trip em UTC — sem shift de fuso.
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) return null;
  if (props.withTime) {
    if (Number(hh ?? '0') > 23 || Number(mi ?? '0') > 59) return null;
    return `${y}-${mo}-${da}T${hh ?? '00'}:${mi ?? '00'}`;
  }
  return `${y}-${mo}-${da}`;
}

const text = ref(isoToDisplay(props.modelValue));
watch(
  () => props.modelValue,
  (v) => { const d = isoToDisplay(v); if (d !== text.value) text.value = d; },
);

// Valores para os pickers (derivados do modelValue atual).
const dateIso = computed(() => (props.modelValue ? props.modelValue.split('T')[0] : ''));
const timeVal = computed(() => {
  const t = props.modelValue?.split('T')[1];
  return t ? t.slice(0, 5) : '00:00';
});

function onType(val: string | number | null) {
  const str = String(val ?? '');
  text.value = str;
  const iso = displayToIso(str);
  if (iso) emit('update:modelValue', iso);
  else if (!str.replace(/[^\d]/g, '')) emit('update:modelValue', null);
}

function onPickDate(val: string | null) {
  if (!val) { emit('update:modelValue', null); return; }
  const iso = props.withTime ? `${val}T${timeVal.value}` : val;
  text.value = isoToDisplay(iso);
  emit('update:modelValue', iso);
}

function onPickTime(val: string | null) {
  const date = dateIso.value;
  if (!date) return;
  const iso = `${date}T${val ?? '00:00'}`;
  text.value = isoToDisplay(iso);
  emit('update:modelValue', iso);
}
</script>

<style scoped>
.app-date__popup { display: flex; flex-wrap: wrap; }
</style>
