// Tipos do Console Administrativo (Control Plane, ADR-024) — espelham os Resources da API.

export type TenantStatus = 'provisioning' | 'trial' | 'active' | 'suspended' | 'failed';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'discarded';
export type ProvisioningStatus = 'pending' | 'creating' | 'migrating' | 'seeding' | 'ready' | 'failed';

export interface PlanRef {
  slug: string | null;
  name: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  plan?: PlanRef | null;
  created_at: string;
  updated_at?: string;
}

export interface ProvisioningRun {
  id: number;
  tenant_id: string;
  status: ProvisioningStatus;
  step: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformLead {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  segment: string | null;
  company_size: string | null;
  message: string | null;
  plan_slug: string | null;
  source: string | null;
  consent: boolean;
  attribution: Record<string, string>;
  status: LeadStatus;
  tenant_id: string | null;
  converted_at: string | null;
  created_at: string;
}

export interface Plan {
  slug: string;
  name: string;
  description?: string | null;
  price_amount?: number | null;
  currency?: string | null;
  billing_period?: string | null;
  highlight?: boolean;
  display_order?: number;
}

/** Resposta do polling de provisionamento (GET /platform/tenants/{slug}/provisioning). */
export interface ProvisioningStatusResponse {
  status: string;
  tenant: Tenant | null;
  run: ProvisioningRun | null;
}

/** Resposta 202 do provisionamento (senha exibida uma única vez). */
export interface ProvisionResult {
  slug: string;
  status: string;
  admin_email: string;
  admin_password: string;
}
