<template>
  <!-- Linhas de texto -->
  <div v-if="variant === 'text'" class="app-skel-block">
    <q-skeleton v-for="n in lines" :key="n" type="text" :width="n === lines ? '55%' : '100%'" />
  </div>

  <!-- Lista com avatar -->
  <div v-else-if="variant === 'list'" class="app-skel-list">
    <div v-for="n in lines" :key="n" class="app-skel-list__row">
      <q-skeleton type="QAvatar" size="40px" />
      <div class="app-skel-list__body">
        <q-skeleton type="text" width="45%" />
        <q-skeleton type="text" width="70%" />
      </div>
    </div>
  </div>

  <!-- Grade de cartões -->
  <div v-else-if="variant === 'cards'" class="app-skel-cards">
    <q-skeleton v-for="n in lines" :key="n" class="app-skel-cards__c" />
  </div>

  <!-- Tabela -->
  <div v-else class="app-skel-table">
    <div v-for="n in lines" :key="n" class="app-skel-table__row">
      <q-skeleton type="text" width="100%" />
    </div>
  </div>
</template>

<script setup lang="ts">
/** AppSkeleton — placeholders de carregamento coesos (Camada 1 · Product Polish). */
withDefaults(defineProps<{ variant?: 'text' | 'list' | 'cards' | 'table'; lines?: number }>(), {
  variant: 'text', lines: 4,
});
</script>

<style scoped>
.app-skel-block { display: flex; flex-direction: column; gap: 8px; }
.app-skel-list { display: flex; flex-direction: column; gap: var(--space-4); }
.app-skel-list__row { display: flex; gap: var(--space-3); align-items: flex-start; }
.app-skel-list__body { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
.app-skel-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-4); }
.app-skel-cards__c { height: 96px; border-radius: var(--radius-lg); }
.app-skel-table { display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-2) 0; }
</style>
