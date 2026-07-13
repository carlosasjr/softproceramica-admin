import { Dialog } from 'quasar';

interface ConfirmOptions {
  title?: string;
  message: string;
  okLabel?: string;
  color?: string;
  icon?: string;
}

/** Confirmação para operações destrutivas (12_UI_UX). Retorna Promise<boolean>. */
export function useConfirm() {
  return (opts: ConfirmOptions): Promise<boolean> =>
    new Promise((resolve) => {
      Dialog.create({
        title: opts.title ?? 'Confirmar',
        message: opts.message,
        cancel: { label: 'Cancelar', flat: true, color: 'grey-7' },
        ok: { label: opts.okLabel ?? 'Confirmar', unelevated: true, color: opts.color ?? 'negative' },
        persistent: true,
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
        .onDismiss(() => resolve(false));
    });
}
