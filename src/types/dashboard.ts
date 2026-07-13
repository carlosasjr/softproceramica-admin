import type { IaMeta } from './ia';

/** Tipos do Dashboard consolidado (M5). Espelham os *DashboardService de cada bounded context. */

/** Período (dias) das métricas de fluxo; `null` = "Tudo". */
export type PeriodoDias = 7 | 30 | 90 | null;

/* ------------------------------- CRM (D1) ------------------------------- */

export interface FunilConversao {
  abertas: number;
  ganhas: number;
  perdidas: number;
  total: number;
  taxa_conversao: number; // 0..1
  valor_ganho: number; // receita ganha no período
}

export interface FunilReceitaPrevista {
  valor_em_negociacao: number; // Σ valor das abertas (pipeline)
  valor_ponderado: number; // Σ valor × probabilidade
}

export interface FunilEtapa {
  etapa_id: number;
  funil_id: number;
  nome: string;
  ordem: number;
  total: number;
  valor_total: number;
}

/** Resposta de `GET /crm/dashboard/funil`. */
export interface DashboardFunil {
  pipeline_por_etapa: FunilEtapa[];
  conversao: FunilConversao;
  receita_prevista: FunilReceitaPrevista;
  periodo_dias: number | null;
}

/* ---------------------------- Comercial (D2) ---------------------------- */

export interface ComercialFluxo {
  enviadas: number;
  aprovadas: number;
  reprovadas: number;
  receita_aprovada: number;
  taxa_conversao: number; // 0..1
}

/** Resposta de `GET /comercial/dashboard`. */
export interface ComercialDashboard {
  propostas_por_status: Record<string, number>;
  fluxo: ComercialFluxo;
  periodo_dias: number | null;
}

/* --------------------------- Atendimento (D3) --------------------------- */

export interface AtendimentoFluxo {
  atendidas: number;
  tempo_medio_seg: number;
}

export interface AtendimentoSla {
  avaliadas: number;
  dentro: number;
  taxa: number; // 0..1
}

export interface BacklogFila {
  fila_id: number;
  fila: string;
  total: number;
}

/** Resposta de `GET /atendimento/dashboard`. */
export interface AtendimentoDashboard {
  por_status: Record<string, number>;
  backlog_por_fila: BacklogFila[];
  fluxo: AtendimentoFluxo;
  sla: AtendimentoSla;
  periodo_dias: number | null;
}

/**
 * Insights de gestor sobre o Funil gerados por IA (Fatia 4 — ADR-021). SUGESTÃO efêmera; `meta.uso_id`
 * identifica o uso p/ feedback. Resposta de `POST /crm/dashboard/insights`.
 */
export interface DashboardInsights {
  destaques: string[];
  riscos: string[];
  recomendacoes: string[];
  meta: IaMeta;
}
