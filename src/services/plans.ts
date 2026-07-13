import { api } from './http';
import type { Plan } from '@/types/admin';

/** Planos para o formulário de provisionamento (inclui não públicos). */
export const plansService = {
  async list(): Promise<Plan[]> {
    const { data } = await api.get('/platform/plans');
    return data.data ?? [];
  },
};
