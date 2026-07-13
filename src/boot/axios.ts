import { defineBoot } from '@quasar/app-vite/wrappers';
import { Notify } from 'quasar';
import { api } from '@/services/http';
import { useAuthStore } from '@/stores/auth';

// Interceptor 401 → derruba a sessão do operador e volta ao login (ADR-024).
export default defineBoot(({ router, store }) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        const auth = useAuthStore(store);
        if (auth.isAuthenticated) {
          auth.setToken(null);
          auth.user = null;
          Notify.create({ type: 'warning', message: 'Sessão expirada. Entre novamente.' });
        }
        const current = router.currentRoute.value;
        if (current.name !== 'login') {
          void router.replace({ name: 'login', query: { redirect: current.fullPath } });
        }
      } else if (!error.response) {
        Notify.create({ type: 'negative', message: 'Sem conexão com o servidor.' });
      }
      return Promise.reject(error);
    },
  );
});
