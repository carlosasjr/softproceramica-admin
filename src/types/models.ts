// Tipos compartilhados usados pelo Console (Control Plane, ADR-024).
// O domínio operacional do Tenant NÃO é consumido pelo operador — só envelopes de API
// e o usuário autenticado.

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
