<template>
  <div class="tl-item" :class="{ 'tl-item--important': important }">
    <div class="tl-item__rail" :style="{ background: origin.color }" />
    <div class="tl-item__marker">
      <div class="tl-item__icon" :style="{ background: origin.bg, color: origin.color }">
        <q-icon :name="icon" size="18px" />
      </div>
    </div>
    <div class="tl-item__body">
      <div class="tl-item__top">
        <span class="tl-item__title">{{ event.title }}</span>
        <span class="tl-item__badge" :style="{ background: origin.bg, color: origin.color }">
          {{ origin.emoji }} {{ origin.label }}
        </span>
        <q-icon v-if="important" name="sym_o_star" size="15px" class="tl-item__star" />
      </div>
      <div v-if="event.summary" class="tl-item__summary">{{ event.summary }}</div>
      <div class="tl-item__meta">
        <q-icon name="sym_o_schedule" size="13px" />
        <span>{{ time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/** AppTimelineItem — um evento da Timeline (Camada 2, ADR-013/015). Presentacional. */
import { computed } from 'vue';
import { resolveOrigin, timelineOrigins } from '@/design-system/tokens';
import type { TimelineEvent } from '@/types/models';

const props = defineProps<{ event: TimelineEvent; icon: string; important?: boolean; time: string }>();
const origin = computed(() => timelineOrigins[resolveOrigin(props.event.source_context)]);
</script>

<style scoped>
.tl-item { position: relative; display: flex; gap: var(--space-3); padding: 2px 0 var(--space-5) 12px; }
.tl-item__rail { position: absolute; left: 0; top: 4px; width: 3px; height: 100%; border-radius: 3px; opacity: .5; }
.tl-item:last-child .tl-item__rail { height: 34px; }
.tl-item__icon {
  width: 38px; height: 38px; border-radius: var(--radius-md); display: grid; place-items: center;
  border: 1px solid var(--border);
}
.tl-item__body { padding-top: 2px; min-width: 0; flex: 1; }
.tl-item__top { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
.tl-item__title { font-weight: var(--fw-semibold); color: var(--ink); font-size: var(--text-md); }
.tl-item__badge { font-size: var(--text-2xs); font-weight: var(--fw-semibold); padding: 1px 8px; border-radius: var(--radius-pill); white-space: nowrap; }
.tl-item__star { color: var(--warning); }
.tl-item__summary { color: var(--ink-2); font-size: var(--text-sm); margin-top: 3px; }
.tl-item__meta { color: var(--ink-3); font-size: var(--text-xs); margin-top: 5px; display: flex; align-items: center; gap: 5px; }
.tl-item--important { background: linear-gradient(90deg, var(--warning-bg), transparent 40%); border-radius: var(--radius-md); }
.tl-item--important .tl-item__rail { opacity: 1; background: var(--warning); }
</style>
