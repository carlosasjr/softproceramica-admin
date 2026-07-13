/**
 * Tipos neutros da IA assistiva (M5 — ADR-021), compartilhados entre domínios (Atendimento, CRM…).
 * A saída é sempre SUGESTÃO (apoio à decisão), efêmera; `meta.uso_id` identifica o uso p/ feedback.
 */

export interface IaMeta {
  uso_id: number;
  provider: string;
  model: string;
  latency_ms: number;
}

/** Resumo assistivo genérico (síntese + pontos + próximos passos). */
export interface IaResumo {
  resumo: string;
  pontos: string[];
  proximos_passos: string[];
  meta: IaMeta;
}
