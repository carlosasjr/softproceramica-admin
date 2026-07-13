/**
 * Design System — ponto único de importação (ADR-015).
 * Uso: `import { AppPage, AppCard, AppStatus } from '@/design-system';`
 */

// Camada 1 — Primitivos
export { default as AppPage } from './components/base/AppPage.vue';
export { default as AppCard } from './components/base/AppCard.vue';
export { default as AppSection } from './components/base/AppSection.vue';
export { default as AppPageTitle } from './components/base/AppPageTitle.vue';
export { default as AppStatus } from './components/base/AppStatus.vue';
export { default as AppBadge } from './components/base/AppBadge.vue';
export { default as AppChip } from './components/base/AppChip.vue';
export { default as AppAvatar } from './components/base/AppAvatar.vue';
export { default as AppEmptyState } from './components/base/AppEmptyState.vue';
export { default as AppMetricCard } from './components/base/AppMetricCard.vue';
export { default as AppSkeleton } from './components/base/AppSkeleton.vue';
export { default as AppLoading } from './components/base/AppLoading.vue';
export { default as AppMoneyInput } from './components/base/AppMoneyInput.vue';
export { default as AppDateInput } from './components/base/AppDateInput.vue';

// Camada 2 — Compostos
export { default as AppTimeline } from './components/composed/AppTimeline.vue';
export { default as AppTimelineItem } from './components/composed/AppTimelineItem.vue';
export { default as AppDialog } from './components/composed/AppDialog.vue';
export { default as AppSearch } from './components/composed/AppSearch.vue';
export { default as AppFilterBar } from './components/composed/AppFilterBar.vue';

// Camada 0 — Tokens (valores JS)
export * from './tokens';
