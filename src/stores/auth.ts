import { defineStore } from 'pinia';
import { api, setAuthToken } from '@/services/http';
import type { AuthUser } from '@/types/models';

// Sessão do OPERADOR da Plataforma (Control Plane, ADR-009/024). Token no localStorage,
// realm separado do app de Tenant (chave própria). Sem RBAC de operador nesta fatia.
const TOKEN_KEY = 'conecta_admin_token';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
    user: null,
    ready: false,
  }),

  getters: {
    isAuthenticated: (s): boolean => !!s.token,
    initials: (s): string => {
      const name = s.user?.name?.trim();
      if (!name) return 'OP';
      const parts = name.split(/\s+/);
      return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase();
    },
  },

  actions: {
    setToken(token: string | null) {
      this.token = token;
      setAuthToken(token);
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    },

    async hydrate() {
      if (!this.token) {
        this.ready = true;
        return;
      }
      setAuthToken(this.token);
      try {
        await this.fetchMe();
      } catch {
        this.setToken(null);
      } finally {
        this.ready = true;
      }
    },

    async login(email: string, password: string) {
      const { data } = await api.post('/platform/auth/login', { email, password });
      this.setToken(data.token);
      this.user = data.user;
    },

    async fetchMe() {
      const { data } = await api.get('/platform/me');
      this.user = data.user;
    },

    async logout() {
      try {
        await api.post('/platform/auth/logout');
      } catch {
        /* ignora — vamos limpar localmente de qualquer forma */
      }
      this.setToken(null);
      this.user = null;
    },
  },
});
