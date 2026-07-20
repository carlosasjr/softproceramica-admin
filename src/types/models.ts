// Tipos compartilhados usados pelo Console (Control Plane, ADR-024).
// O domínio operacional do Tenant NÃO é consumido pelo operador — só envelopes de API,
// o usuário autenticado e o evento de Timeline (design-system).

export interface TimelineEvent {
  id: number;
  customer_id: number;
  occurred_at: string;
  type: string;
  source_context: string;
  subject_type: string | null;
  subject_id: number | null;
  actor_type: string | null;
  actor_id: number | null;
  title: string;
  summary: string | null;
  metadata: Record<string, unknown> | null;
}

// Envelopes da API (Laravel Resource / paginação).
export interface Paginated<T> {
  data: T[];
  meta?: { current_page: number; last_page: number; total: number; per_page: number };
  links?: unknown;
}
export interface Wrapped<T> {
  data: T;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}
