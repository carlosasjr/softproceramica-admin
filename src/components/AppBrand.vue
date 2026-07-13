<template>
  <img
    :src="src"
    :alt="alt"
    :style="{ height: `${height}px` }"
    class="app-brand"
    draggable="false"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import horizontalLight from '@/assets/logo-horizontal-light.png';
import horizontalDark from '@/assets/logo-horizontal-dark.png';
import markLight from '@/assets/mark-light.png';
import markDark from '@/assets/mark-dark.png';

const props = withDefaults(defineProps<{ variant?: 'horizontal' | 'mark'; height?: number }>(), {
  variant: 'horizontal',
  height: 34,
});

const $q = useQuasar();
const alt = 'SoftPro Conecta Cerâmica';

const src = computed(() => {
  if (props.variant === 'mark') return $q.dark.isActive ? markDark : markLight;
  return $q.dark.isActive ? horizontalDark : horizontalLight;
});
</script>

<style scoped>
.app-brand { display: block; width: auto; user-select: none; }
</style>
