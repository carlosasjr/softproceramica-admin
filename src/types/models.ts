// Tipos do domínio — espelham os API Resources do backend (M2).

export type TipoPessoa = 'fisica' | 'juridica';
export type LeadStatus = 'novo' | 'qualificado' | 'convertido' | 'descartado';
export type OpportunityStatus = 'aberta' | 'ganha' | 'perdida';
export type ActivityStatus = 'pendente' | 'concluida' | 'cancelada';
export type ActivityType = 'ligacao' | 'reuniao' | 'visita' | 'follow_up' | 'tarefa' | 'lembrete';

export interface Contato {
  id: number;
  cliente_id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  cargo: string | null;
  is_titular: boolean;
}

export interface Cliente {
  id: number;
  branch_id: number | null;
  tipo_pessoa: TipoPessoa;
  tipo_label: string;
  nome: string;
  documento: string | null;
  razao_social: string | null;
  nome_fantasia: string | null;
  inscricao_estadual: string | null;
  email: string | null;
  telefone: string | null;
  contatos?: Contato[];
  titular?: Contato | null;
  // Agregados (Sprint 06): lista enriquecida e detalhe (Cliente 360°). Presentes conforme o endpoint.
  ultimo_atendimento_at?: string | null;
  ultima_interacao_at?: string | null;
  oportunidades_abertas?: number;
  valor_em_negociacao?: number;
  oportunidades_count?: number;
  oportunidades_valor_total?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Etapa {
  id: number;
  funil_id: number;
  nome: string;
  cor: string | null;
  ordem: number;
  probabilidade: number | null;
  tempo_esperado_dias: number | null;
  is_inicial: boolean;
  is_final: boolean;
  is_ganho: boolean;
  is_perdido: boolean;
}

export interface Funil {
  id: number;
  branch_id: number | null;
  nome: string;
  descricao: string | null;
  is_padrao: boolean;
  ativo: boolean;
  etapas?: Etapa[];
}

export interface Lead {
  id: number;
  cliente_id: number;
  contato_id: number | null;
  titulo: string | null;
  origem: string | null;
  canal: string | null;
  status: LeadStatus;
  valor_estimado: string | null;
  observacao: string | null;
  oportunidade_id: number | null;
  created_at?: string;
}

export interface Oportunidade {
  id: number;
  cliente_id: number;
  contato_id: number | null;
  funil_id: number;
  etapa_id: number;
  responsavel_id: number | null;
  lead_id: number | null;
  titulo: string;
  valor: string | null;
  probabilidade: number | null;
  status: OpportunityStatus;
  posicao: number;
  motivo_perda: string | null;
  encerrada_em: string | null;
  cliente?: Cliente;
  created_at?: string;
  // Contexto do vendedor (A5) — opcionais; backend enriquece na Fase 2 (M7).
  etapa?: { id: number; nome: string } | null;
  responsavel?: { id: number; name: string } | null;
  origem?: string | null;
  ultima_interacao?: string | null;
  dias_sem_contato?: number | null;
}

export interface TimelineEvent {
  id: number;
  cliente_id: number;
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

export interface Atividade {
  id: number;
  cliente_id: number;
  oportunidade_id: number | null;
  responsavel_id: number | null;
  tipo: ActivityType;
  titulo: string;
  descricao: string | null;
  agendada_para: string;
  termina_em: string | null;
  status: ActivityStatus;
  concluida_em: string | null;
}

export interface BoardColumn {
  etapa_id: number;
  nome: string;
  ordem: number;
  oportunidades: Oportunidade[];
}

export interface KanbanBoard {
  funil_id: number;
  colunas: BoardColumn[];
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
export interface EffectivePermission {
  permission: string;
  scope_type: 'tenant' | 'branch' | 'department';
  scope_id: number | null;
}
