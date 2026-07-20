import type { StatusTone } from '@/design-system/tokens';
import type { LeadStatus, ProvisioningStatus, TenantStatus } from '@/types/admin';

interface Badge {
  label: string;
  tone: StatusTone;
}

const TENANT: Record<TenantStatus, Badge> = {
  provisioning: { label: 'Provisionando', tone: 'amber' },
  trial: { label: 'Trial', tone: 'blue' },
  active: { label: 'Ativo', tone: 'green' },
  suspended: { label: 'Suspenso', tone: 'grey' },
  failed: { label: 'Falhou', tone: 'red' },
};

const LEAD: Record<LeadStatus, Badge> = {
  new: { label: 'Novo', tone: 'blue' },
  contacted: { label: 'Em contato', tone: 'amber' },
  qualified: { label: 'Qualificado', tone: 'purple' },
  converted: { label: 'Convertido', tone: 'green' },
  discarded: { label: 'Descartado', tone: 'grey' },
};

const RUN: Record<ProvisioningStatus, Badge> = {
  pending: { label: 'Na fila', tone: 'grey' },
  creating: { label: 'Criando banco', tone: 'amber' },
  migrating: { label: 'Migrando', tone: 'amber' },
  seeding: { label: 'Semeando', tone: 'amber' },
  ready: { label: 'Pronto', tone: 'green' },
  failed: { label: 'Falhou', tone: 'red' },
};

const FALLBACK: Badge = { label: '—', tone: 'grey' };

export const tenantBadge = (s: string): Badge => TENANT[s as TenantStatus] ?? FALLBACK;
export const leadBadge = (s: string): Badge => LEAD[s as LeadStatus] ?? FALLBACK;
export const runBadge = (s: string): Badge => RUN[s as ProvisioningStatus] ?? FALLBACK;

/** Opções de triagem de lead (exclui `converted` — só a promoção o atinge). */
export const LEAD_TRIAGE_OPTIONS: { label: string; value: LeadStatus }[] = [
  { label: 'Novo', value: 'new' },
  { label: 'Em contato', value: 'contacted' },
  { label: 'Qualificado', value: 'qualified' },
  { label: 'Descartado', value: 'discarded' },
];
