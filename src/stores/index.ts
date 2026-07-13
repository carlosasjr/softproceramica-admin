import { defineStore } from '@quasar/app-vite/wrappers';
import { createPinia } from 'pinia';

/**
 * Instância Pinia da aplicação (uma por request no SSR; singleton no SPA/PWA).
 * Stores por domínio ficam em src/stores/*.
 */
export default defineStore(() => {
  return createPinia();
});
