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

export type StatusTone = 'orange' | 'green' | 'red' | 'blue' | 'amber' | 'grey' | 'purple';
