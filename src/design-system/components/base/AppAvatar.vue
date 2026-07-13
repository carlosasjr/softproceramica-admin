<template>
  <q-avatar :size="size" class="app-avatar" :style="style">
    <q-icon v-if="icon" :name="icon" :size="iconSize" />
    <template v-else>{{ initials }}</template>
  </q-avatar>
</template>

<script setup lang="ts">
/** AppAvatar — avatar por iniciais ou ícone, com tom (Camada 1). */
import { computed } from 'vue';
import type { StatusTone } from '@/design-system/tokens';

const props = withDefaults(defineProps<{
  name?: string; icon?: string; tone?: StatusTone; size?: string; brand?: boolean;
}>(), { size: '40px', tone: 'grey' });

const iconSize = computed(() => `calc(${props.size} * 0.5)`);

const initials = computed(() => {
  const p = (props.name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '?';
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1]![0] : '')).toUpperCase();
});

const style = computed(() => {
  if (props.brand) return { background: 'linear-gradient(135deg,#f58220,#e86a0c)', color: '#fff' };
  return { background: `var(--tone-${props.tone}-bg)`, color: `var(--tone-${props.tone}-fg)` };
});
</script>

<style scoped>
.app-avatar { font-weight: var(--fw-semibold); font-size: var(--text-sm); }
</style>
