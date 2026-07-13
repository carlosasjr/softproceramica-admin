/**
 * Design System — Camada 0 · Tokens consumidos em JS/TS (ADR-015).
 * Fonte única para valores que o CSS não alcança (ex.: cores passadas a libs,
 * ordenação de etapas do Kanban). Remove duplicação (T3): stageColors vivia
 * em PipelinePage e FunisPage.
 */

/** Paleta de cores das etapas do funil (ordem estável). */
export const stageColors = [
  '#f58220', '#3b82f6', '#8b5cf6', '#16a34a', '#e5484d', '#f59e0b', '#0ea5e9',
] as const;

/** Retorna a cor da etapa pelo índice (cicla). */
export function stageColor(index: number): string {
  return stageColors[index % stageColors.length] ?? stageColors[0];
}

/** Origens da Timeline (ADR-013) → identidade visual. */
export type TimelineOrigin =
  | 'whatsapp' | 'crm' | 'atendimento' | 'agenda' | 'comercial' | 'sistema' | 'ia';

export interface OriginStyle {
  label: string;
  /** var() de cor no tema (Camada 0). */
  color: string;
  bg: string;
  icon: string;
  emoji: string;
}

export const timelineOrigins: Record<TimelineOrigin, OriginStyle> = {
  whatsapp:    { label: 'WhatsApp',   color: 'var(--origin-whatsapp)',    bg: 'var(--origin-whatsapp-bg)',    icon: 'sym_o_chat',        emoji: '🟢' },
  crm:         { label: 'CRM',        color: 'var(--origin-crm)',         bg: 'var(--origin-crm-bg)',         icon: 'sym_o_hub',         emoji: '🔵' },
  atendimento: { label: 'Atendimento',color: 'var(--origin-atendimento)', bg: 'var(--origin-atendimento-bg)', icon: 'sym_o_forum',       emoji: '🟣' },
  agenda:      { label: 'Agenda',     color: 'var(--origin-agenda)',      bg: 'var(--origin-agenda-bg)',      icon: 'sym_o_event',       emoji: '🟠' },
  comercial:   { label: 'Comercial',  color: 'var(--origin-comercial)',   bg: 'var(--origin-comercial-bg)',   icon: 'sym_o_description',  emoji: '🔴' },
  sistema:     { label: 'Sistema',    color: 'var(--origin-sistema)',     bg: 'var(--origin-sistema-bg)',     icon: 'sym_o_settings',    emoji: '🟤' },
  ia:          { label: 'IA',         color: 'var(--origin-ia)',          bg: 'var(--origin-ia-bg)',          icon: 'sym_o_smart_toy',   emoji: '🤖' },
};

/**
 * Mapeia `source_context` (backend) → origem visual. Contextos ainda inexistentes
 * (atendimento/comercial/ia) já ficam preparados (ADR-011).
 */
export function resolveOrigin(sourceContext: string | null | undefined): TimelineOrigin {
  const c = (sourceContext ?? '').toLowerCase();
  if (c.includes('whats')) return 'whatsapp';
  if (c.includes('atend') || c.includes('conversa') || c.includes('canal')) return 'atendimento';
  if (c.includes('agenda') || c.includes('atividade')) return 'agenda';
  if (c.includes('comerc') || c.includes('proposta') || c.includes('pedido')) return 'comercial';
  if (c.includes('ia') || c.includes('ai')) return 'ia';
  if (c.includes('sist') || c.includes('erp') || c.includes('system')) return 'sistema';
  return 'crm';
}

export type StatusTone = 'orange' | 'green' | 'red' | 'blue' | 'amber' | 'grey' | 'purple';
