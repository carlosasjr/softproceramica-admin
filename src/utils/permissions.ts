/**
 * Catálogo amigável de permissões RBAC (ADR-010).
 *
 * Traduz as chaves técnicas do backend (`modulo.recurso.acao`, ex.: `crm.cliente.manage`)
 * em rótulos legíveis, agrupamento por módulo/recurso e descrição — para o preview de
 * "Permissões efetivas" (Papéis & Acessos) não expor código cru ao usuário.
 *
 * Fonte da verdade das chaves: `*Seeder.php` de cada domínio (Access/Atendimento/Comercial/Crm).
 * Chaves desconhecidas caem num fallback legível (nunca quebram a tela).
 */

type Tone = 'orange' | 'green' | 'red' | 'blue' | 'grey' | 'amber' | 'purple';

export type PermissionModule = 'access' | 'atendimento' | 'comercial' | 'crm' | 'outros';

interface ModuleMeta {
  label: string;
  icon: string;
  order: number;
}

/** Módulos (bounded contexts) e sua apresentação. `order` define a ordem no preview. */
export const permissionModules: Record<PermissionModule, ModuleMeta> = {
  access: { label: 'Administração', icon: 'sym_o_admin_panel_settings', order: 0 },
  atendimento: { label: 'Atendimento', icon: 'sym_o_support_agent', order: 1 },
  comercial: { label: 'Comercial', icon: 'sym_o_sell', order: 2 },
  crm: { label: 'CRM', icon: 'sym_o_diversity_3', order: 3 },
  outros: { label: 'Outros', icon: 'sym_o_lock', order: 99 },
};

/** Rótulo do recurso, indexado por `modulo.recurso`. */
const resourceLabels: Record<string, string> = {
  'access.user': 'Usuários',
  'access.role': 'Papéis & acessos',
  'access.branch': 'Filiais',
  'access.department': 'Departamentos',
  'atendimento.conversa': 'Conversas',
  'atendimento.fila': 'Filas',
  'atendimento.canal': 'Canais',
  'comercial.produto': 'Produtos',
  'comercial.tabela_preco': 'Tabelas de preço',
  'comercial.proposta': 'Propostas',
  'crm.cliente': 'Clientes',
  'crm.timeline': 'Timeline',
  'crm.funil': 'Funil de vendas',
  'crm.lead': 'Leads',
  'crm.oportunidade': 'Oportunidades',
  'crm.atividade': 'Atividades',
  'crm.dashboard': 'Dashboard',
};

/** Rótulo + tom da ação (o verbo do que a permissão concede). */
const actionMeta: Record<string, { label: string; tone: Tone }> = {
  view: { label: 'Ver', tone: 'grey' },
  manage: { label: 'Gerenciar', tone: 'blue' },
  transfer: { label: 'Transferir', tone: 'amber' },
  send: { label: 'Enviar', tone: 'green' },
  move: { label: 'Mover', tone: 'purple' },
};

/** Descrição amigável por chave completa (tooltip). Chaves sem entrada usam texto genérico. */
const descriptions: Record<string, string> = {
  'access.user.view': 'Visualizar a lista de usuários do Tenant.',
  'access.user.manage': 'Convidar, suspender e reativar usuários.',
  'access.role.view': 'Ver papéis atribuídos e permissões efetivas.',
  'access.role.manage': 'Atribuir e remover papéis das pessoas.',
  'access.branch.view': 'Visualizar as filiais.',
  'access.branch.manage': 'Criar e editar filiais.',
  'access.department.view': 'Visualizar departamentos.',
  'access.department.manage': 'Criar e editar departamentos.',
  'atendimento.conversa.view': 'Acompanhar as conversas do atendimento.',
  'atendimento.conversa.manage': 'Responder e encerrar conversas.',
  'atendimento.conversa.transfer': 'Transferir conversas entre filas e agentes.',
  'atendimento.fila.view': 'Visualizar as filas de atendimento.',
  'atendimento.fila.manage': 'Configurar filas (SLA, distribuição, horários).',
  'atendimento.canal.manage': 'Configurar canais de entrada (WhatsApp, formulário…).',
  'comercial.produto.view': 'Consultar o catálogo de produtos.',
  'comercial.produto.manage': 'Cadastrar e editar produtos.',
  'comercial.tabela_preco.view': 'Consultar as tabelas de preço.',
  'comercial.tabela_preco.manage': 'Criar e editar tabelas de preço.',
  'comercial.proposta.view': 'Visualizar propostas comerciais.',
  'comercial.proposta.manage': 'Criar e editar propostas.',
  'comercial.proposta.send': 'Enviar propostas e gerar o link público.',
  'crm.cliente.view': 'Consultar clientes e contatos.',
  'crm.cliente.manage': 'Cadastrar e editar clientes e contatos.',
  'crm.timeline.view': 'Ver a timeline do cliente.',
  'crm.timeline.manage': 'Registrar interações na timeline.',
  'crm.funil.view': 'Visualizar os funis de vendas.',
  'crm.funil.manage': 'Configurar funis e etapas.',
  'crm.lead.view': 'Consultar leads.',
  'crm.lead.manage': 'Criar, qualificar e converter leads.',
  'crm.oportunidade.view': 'Visualizar oportunidades.',
  'crm.oportunidade.manage': 'Criar e editar oportunidades.',
  'crm.oportunidade.move': 'Mover oportunidades entre etapas do funil.',
  'crm.atividade.view': 'Ver atividades agendadas.',
  'crm.atividade.manage': 'Agendar e concluir atividades.',
  'crm.dashboard.view': 'Acessar o dashboard do CRM.',
};

export interface PermissionDescriptor {
  key: string;
  module: PermissionModule;
  moduleLabel: string;
  moduleIcon: string;
  moduleOrder: number;
  /** `modulo.recurso` — agrupa as ações do mesmo recurso. */
  resourceKey: string;
  resourceLabel: string;
  action: string;
  actionLabel: string;
  actionTone: Tone;
  /** Frase amigável completa: "Gerenciar clientes". */
  label: string;
  /** Descrição para tooltip. */
  description: string;
}

/** Humaniza um segmento cru (`tabela_preco` → "Tabela preco") como último recurso. */
function humanize(segment: string): string {
  const s = segment.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Decompõe e descreve uma chave de permissão (`modulo.recurso.acao`).
 * Tolerante a chaves desconhecidas: sempre devolve rótulos legíveis.
 */
export function describePermission(key: string): PermissionDescriptor {
  const parts = key.split('.');
  const moduleKey = parts[0] ?? '';
  const action = parts.length > 1 ? parts[parts.length - 1]! : '';
  const resourceKey = parts.length > 2 ? parts.slice(0, -1).join('.') : key;

  const module: PermissionModule = moduleKey in permissionModules
    ? (moduleKey as PermissionModule)
    : 'outros';
  const mod = permissionModules[module];

  const resourceLabel = resourceLabels[resourceKey]
    ?? humanize(parts.length > 2 ? parts[1]! : moduleKey);

  const act = actionMeta[action] ?? { label: humanize(action || 'Acesso'), tone: 'grey' as Tone };

  return {
    key,
    module,
    moduleLabel: mod.label,
    moduleIcon: mod.icon,
    moduleOrder: mod.order,
    resourceKey,
    resourceLabel,
    action,
    actionLabel: act.label,
    actionTone: act.tone,
    label: `${act.label} ${resourceLabel.toLowerCase()}`,
    description: descriptions[key] ?? `Permite ${act.label.toLowerCase()} · ${resourceLabel}.`,
  };
}
