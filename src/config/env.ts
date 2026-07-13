// Console Administrativo (ADR-024): API do Control Plane no domínio CENTRAL — sem tenancy,
// sem subdomínio de Tenant (ADR-009 de resolução NÃO se aplica ao operador). baseURL vem de
// VITE_API_URL (dev/container) ou, em produção, do próprio host administrativo.

const env = import.meta.env as Record<string, string | undefined>;

/** Base da API de operador (ex.: http://localhost:8090/api). */
export function apiBaseUrl(): string {
  const base = env.VITE_API_URL?.replace(/\/$/, '');
  if (base) return `${base}/api`;

  const scheme = typeof window !== 'undefined' ? window.location.protocol : 'https:';
  const host = typeof window !== 'undefined' ? window.location.host : 'localhost';
  return `${scheme}//${host}/api`;
}
