<template>
  <span class="app-status" :class="`app-status--${tone}`">
    <span v-if="!hideDot" class="app-status__dot" />
    <q-icon v-if="icon" :name="icon" size="14px" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
/** AppStatus — chip de status por tom (Camada 1). Sucede StatusChip; usa tokens de cor. */
import type { StatusTone } from '@/design-system/tokens';
withDefaults(defineProps<{ label: string; tone?: StatusTone; icon?: string; hideDot?: boolean }>(), {
  tone: 'grey', hideDot: false,
});
</script>

<style scoped>
.app-status {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: var(--text-xs); font-weight: var(--fw-semibold); padding: 3px 10px;
  border-radius: var(--radius-pill); white-space: nowrap;
}
.app-status__dot { width: 8px; height: 8px; border-radius: 50%; }
.app-status--orange { color: var(--tone-orange-fg); background: var(--tone-orange-bg); }
.app-status--orange .app-status__dot { background: var(--tone-orange-dot); }
.app-status--green { color: var(--tone-green-fg); background: var(--tone-green-bg); }
.app-status--green .app-status__dot { background: var(--tone-green-dot); }
.app-status--red { color: var(--tone-red-fg); background: var(--tone-red-bg); }
.app-status--red .app-status__dot { background: var(--tone-red-dot); }
.app-status--blue { color: var(--tone-blue-fg); background: var(--tone-blue-bg); }
.app-status--blue .app-status__dot { background: var(--tone-blue-dot); }
.app-status--amber { color: var(--tone-amber-fg); background: var(--tone-amber-bg); }
.app-status--amber .app-status__dot { background: var(--tone-amber-dot); }
.app-status--grey { color: var(--tone-grey-fg); background: var(--tone-grey-bg); }
.app-status--grey .app-status__dot { background: var(--tone-grey-dot); }
.app-status--purple { color: var(--tone-purple-fg); background: var(--tone-purple-bg); }
.app-status--purple .app-status__dot { background: var(--tone-purple-dot); }
</style>
