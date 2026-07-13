import type { Cliente } from './models';
import type { IaMeta, IaResumo } from './ia';

/** Tipos do Atendimento/Omnichannel (E8.3), espelhando os API Resources do backend (M3). */

export type ConversaStatus = 'aberta' | 'em_fila' | 'em_atendimento' | 'encerrada';
export type MessageDirection = 'inbound' | 'outbound';
export type Prioridade = 'baixa' | 'normal' | 'alta' | 'urgente';
export type CanalTipo =
  | 'whatsapp' | 'formulario' | 'api_leads' | 'landing_publica'
  | 'instagram' | 'facebook' | 'chat_widget' | 'email';

export type FilaEstrategia = 'manual' | 'round_robin' | 'menos_ocupado';

export interface Fila {
  id: number;
  department_id: number | null;
  nome: string;
  descricao: string | null;
  estrategia_distribuicao: string;
  sla_minutos: number | null;
  is_padrao: boolean;
  ordem: number;
  ativo: boolean;
  /** Presente só no modo gestão (`com_inativas`): conversas não-encerradas na fila. */
  conversas_ativas_count?: number;
}

/** Payload de criação de Fila (department_id obrigatório — a Fila pertence ao Departamento). */
export interface FilaInput {
  department_id: number;
  nome: string;
  descricao?: string | null;
  estrategia_distribuicao?: FilaEstrategia;
  sla_minutos?: number | null;
}

/** Payload de edição de Fila (o Departamento é imutável). */
export interface FilaUpdate {
  nome: string;
  descricao?: string | null;
  estrategia_distribuicao?: FilaEstrategia;
  sla_minutos?: number | null;
}

/** Filial (para o seletor do onboarding de Canal). */
export interface Filial {
  id: number;
  name: string;
}

/** Canal de entrada (M3). WhatsApp guarda a instância própria e o estado da conexão. */
export interface Canal {
  id: number;
  tipo: CanalTipo | string;
  nome: string;
  branch_id: number | null;
  department_id: number | null;
  fila_id: number | null;
  fila_fallback_id: number | null;
  instance: string | null;
  phone: string | null;
  connected: boolean;
  ativo: boolean;
}

/** Resposta da criação: o Canal recém-criado + o QR (base64) para pareamento. */
export interface CanalCriado {
  canal: Canal;
  qr_code: string | null;
}

/** Estado da conexão sincronizado com o provedor. */
export interface CanalStatus {
  connected: boolean;
  state: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  direction: MessageDirection;
  autor_type: string | null;
  autor_id: number | null;
  conteudo: string | null;
  status: string | null;
  enviada_em: string | null;
  created_at?: string | null;
}

export interface Conversation {
  id: number;
  cliente_id: number | null;
  contato_id: number | null;
  canal_id: number | null;
  fila_id: number | null;
  department_id: number | null;
  operador_id: number | null;
  canal_de_origem: CanalTipo | string;
  status: ConversaStatus;
  prioridade: Prioridade | string;
  assunto: string | null;
  ultima_interacao_at: string | null;
  aberta_em: string | null;
  encerrada_em: string | null;
  cliente?: Cliente | null;
  fila?: Fila | null;
  mensagens?: Message[];
  created_at?: string | null;
}

/** Payload de broadcast recebido via Reverb (payload enxuto — ids/status/timestamps). */
export interface LifecyclePayload {
  conversation_id: number;
  fila_id?: number | null;
  fila_origem_id?: number | null;
  fila_destino_id?: number | null;
  operador_id?: number | null;
  cliente_id?: number | null;
  status?: ConversaStatus;
  direction?: MessageDirection; // presente em `.conversa.mensagem`
  ultima_interacao_at?: string | null;
  encerrada_em?: string | null;
}

export interface MessagePayload {
  id: number;
  conversation_id: number;
  direction: MessageDirection;
  conteudo: string | null;
  status?: string | null;
  enviada_em: string | null;
}

/**
 * Resumo assistivo de uma Conversa gerado por IA (M5 · Fatia 1 — ADR-021). Alias do resumo neutro
 * `IaResumo` (mesma forma, fonte única — ver `@/types/ia`).
 */
export type ConversationSummary = IaResumo;

/**
 * Rascunho de resposta ao cliente sugerido por IA (M5 · Fatia 2 — ADR-021). Efêmero e editável:
 * a IA RASCUNHA, o humano ENVIA — só vira mensagem se o operador enviar. `meta.uso_id` p/ feedback.
 */
export interface ReplySuggestion {
  sugestao: string;
  meta: IaMeta;
}
