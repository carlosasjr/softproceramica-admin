type Tone = 'orange' | 'green' | 'red' | 'blue' | 'grey' | 'amber';

// Indexáveis por string (linhas de q-table entregam campos como `any`).
type Info = { label: string; tone: Tone };
type IconInfo = { label: string; icon: string; tone?: Tone };

export const leadStatus: Record<string, Info> = {
  novo: { label: 'Novo', tone: 'blue' },
  qualificado: { label: 'Qualificado', tone: 'amber' },
  convertido: { label: 'Convertido', tone: 'green' },
  descartado: { label: 'Descartado', tone: 'grey' },
};

export const oppStatus: Record<string, Info> = {
  aberta: { label: 'Aberta', tone: 'orange' },
  ganha: { label: 'Ganha', tone: 'green' },
  perdida: { label: 'Perdida', tone: 'red' },
};

// Temperatura da oportunidade (A5) — derivada de probabilidade + dias sem contato.
export type Temperatura = 'quente' | 'morno' | 'frio';
export const temperatura: Record<Temperatura, { label: string; icon: string; tone: Tone; emoji: string }> = {
  quente: { label: 'Quente', icon: 'sym_o_local_fire_department', tone: 'red', emoji: '🔥' },
  morno: { label: 'Morno', icon: 'sym_o_thermostat', tone: 'amber', emoji: '🌤️' },
  frio: { label: 'Frio', icon: 'sym_o_ac_unit', tone: 'blue', emoji: '❄️' },
};

/** Regra de temperatura: alta probabilidade aquece; muitos dias sem contato esfriam. */
export function temperaturaDe(probabilidade: number | null | undefined, diasSemContato?: number | null): Temperatura {
  const p = probabilidade ?? 0;
  const stale = (diasSemContato ?? 0) >= 7;
  if (p >= 65 && !stale) return 'quente';
  if (p >= 35 || (p >= 65 && stale)) return 'morno';
  return 'frio';
}

// Comercial (E5) — status do produto e da proposta (máquina de estados da Foundation 07).
export const produtoStatus: Record<string, Info> = {
  ativo: { label: 'Ativo', tone: 'green' },
  inativo: { label: 'Inativo', tone: 'grey' },
};

export const propostaStatus: Record<string, IconInfo> = {
  rascunho: { label: 'Rascunho', icon: 'sym_o_edit_note', tone: 'grey' },
  enviada: { label: 'Enviada', icon: 'sym_o_send', tone: 'blue' },
  visualizada: { label: 'Visualizada', icon: 'sym_o_visibility', tone: 'orange' },
  em_negociacao: { label: 'Em negociação', icon: 'sym_o_handshake', tone: 'amber' },
  aprovada: { label: 'Aprovada', icon: 'sym_o_check_circle', tone: 'green' },
  reprovada: { label: 'Reprovada', icon: 'sym_o_cancel', tone: 'red' },
  cancelada: { label: 'Cancelada', icon: 'sym_o_block', tone: 'grey' },
};

export const activityStatus: Record<string, Info> = {
  pendente: { label: 'Pendente', tone: 'amber' },
  concluida: { label: 'Concluída', tone: 'green' },
  cancelada: { label: 'Cancelada', tone: 'grey' },
};

export const activityType: Record<string, { label: string; icon: string; tone: Tone }> = {
  ligacao: { label: 'Ligação', icon: 'sym_o_call', tone: 'green' },
  reuniao: { label: 'Reunião', icon: 'sym_o_groups', tone: 'orange' },
  visita: { label: 'Visita', icon: 'sym_o_pin_drop', tone: 'blue' },
  follow_up: { label: 'Follow-up', icon: 'sym_o_replay', tone: 'amber' },
  tarefa: { label: 'Tarefa', icon: 'sym_o_task_alt', tone: 'grey' },
  lembrete: { label: 'Lembrete', icon: 'sym_o_notifications', tone: 'red' },
};

export const tipoPessoa: Record<string, IconInfo> = {
  fisica: { label: 'Pessoa', icon: 'sym_o_person', tone: 'blue' },
  juridica: { label: 'Empresa', icon: 'sym_o_domain', tone: 'orange' },
};

/** Ícone por tipo de evento da Timeline. */
export const timelineIcon: Record<string, string> = {
  cliente_criado: 'sym_o_person_add',
  contato_adicionado: 'sym_o_contacts',
  lead_criado: 'sym_o_bolt',
  oportunidade_criada: 'sym_o_workspaces',
  mudanca_etapa: 'sym_o_moving',
  atividade_agendada: 'sym_o_event',
  atividade_concluida: 'sym_o_task_alt',
  conversa: 'sym_o_forum',
  mensagem: 'sym_o_chat',
  proposta: 'sym_o_description',
};

// Atendimento (E8.3) — status da conversa, prioridade e canal de origem.
export const conversaStatus: Record<string, Info> = {
  aberta: { label: 'Aberta', tone: 'blue' },
  em_fila: { label: 'Em fila', tone: 'amber' },
  em_atendimento: { label: 'Em atendimento', tone: 'orange' },
  encerrada: { label: 'Encerrada', tone: 'grey' },
};

export const conversaPrioridade: Record<string, Info> = {
  baixa: { label: 'Baixa', tone: 'grey' },
  normal: { label: 'Normal', tone: 'blue' },
  alta: { label: 'Alta', tone: 'amber' },
  urgente: { label: 'Urgente', tone: 'red' },
};

export const canalOrigem: Record<string, IconInfo> = {
  whatsapp: { label: 'WhatsApp', icon: 'sym_o_forum', tone: 'green' },
  formulario: { label: 'Formulário', icon: 'sym_o_description', tone: 'blue' },
  api_leads: { label: 'API de Leads', icon: 'sym_o_api', tone: 'grey' },
  landing_publica: { label: 'Landing', icon: 'sym_o_public', tone: 'blue' },
  instagram: { label: 'Instagram', icon: 'sym_o_photo_camera', tone: 'red' },
  facebook: { label: 'Facebook', icon: 'sym_o_thumb_up', tone: 'blue' },
  chat_widget: { label: 'Chat', icon: 'sym_o_chat', tone: 'orange' },
  email: { label: 'E-mail', icon: 'sym_o_mail', tone: 'amber' },
};
