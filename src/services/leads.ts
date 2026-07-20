import { api } from './http';
import type { Paginated, Wrapped } from '@/types/models';
import type { PlatformLeadStatus, PlatformLead } from '@/types/admin';

export interface LeadListParams {
  status?: string;
  search?: string;
  page?: number;
}

/** Triagem de PlatformLeads pelo operador (ADR-024). Promoção é tenantsService.provision(). */
export const leadsService = {
  async list(params: LeadListParams = {}): Promise<Paginated<PlatformLead>> {
    const { data } = await api.get('/platform/leads', { params });
    return data;
  },

  async get(id: number | string): Promise<PlatformLead> {
    const { data } = await api.get<Wrapped<PlatformLead>>(`/platform/leads/${id}`);
    return data.data;
  },

  async updateStatus(id: number | string, status: PlatformLeadStatus): Promise<PlatformLead> {
    const { data } = await api.patch<Wrapped<PlatformLead>>(`/platform/leads/${id}`, { status });
    return data.data;
  },
};
