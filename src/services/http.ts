import axios, { type AxiosInstance } from 'axios';
import { apiBaseUrl } from '@/config/env';

/** Instância única do axios do Console Admin (Control Plane, ADR-024). */
export const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl(),
  headers: { Accept: 'application/json' },
  timeout: 30000,
});

export function setAuthToken(token: string | null): void {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

/** Mensagem amigável a partir de um erro do axios (primeiro erro de validação → message → fallback). */
export function apiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  const e = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
  const data = e?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  return data?.message ?? fallback;
}
