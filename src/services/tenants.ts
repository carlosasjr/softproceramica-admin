import { api } from './http';
import type { Paginated } from '@/types/models';
import type { ProvisioningRun, ProvisioningStatusResponse, ProvisionResult, Tenant } from '@/types/admin';

export interface TenantListParams {
  status?: string;
  search?: string;
  page?: number;
}

export interface ProvisionPayload {
  name: string;
  slug: string;
  admin_name: string;
  admin_email: string;
  admin_password?: string;
  plan_slug?: string;
  document?: string;
  platform_lead_id?: number;
}

/** Gestão de Tenants pelo operador (ADR-024). Páginas nunca chamam a API direto. */
export const tenantsService = {
  async list(params: TenantListParams = {}): Promise<Paginated<Tenant>> {
    const { data } = await api.get('/platform/tenants', { params });
    return data;
  },

  async get(id: string): Promise<{ tenant: Tenant; provisioning: ProvisioningRun | null }> {
    const { data } = await api.get(`/platform/tenants/${id}`);
    return { tenant: data.data, provisioning: data.provisioning ?? null };
  },

  /** Enfileira o provisionamento (202). A UI acompanha via provisioningStatus(slug). */
  async provision(payload: ProvisionPayload): Promise<ProvisionResult> {
    const { data } = await api.post('/platform/tenants', payload);
    return data;
  },

  async provisioningStatus(slug: string): Promise<ProvisioningStatusResponse> {
    const { data } = await api.get(`/platform/tenants/${slug}/provisioning`);
    return data;
  },
};
