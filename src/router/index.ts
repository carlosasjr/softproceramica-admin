import { defineRouter } from '@quasar/app-vite/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from '@/stores/auth';

// Guard de operador (ADR-024): exige sessão do realm `platform`. Sem RBAC de operador nesta fatia.
export default defineRouter(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const auth = useAuthStore(store);
    if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
    if (to.name === 'login' && auth.isAuthenticated) {
      return { name: 'tenants' };
    }
    return true;
  });

  return Router;
});
