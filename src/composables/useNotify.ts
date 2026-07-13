import { Notify } from 'quasar';
import { apiErrorMessage } from '@/services/http';

/** Feedback padronizado (12_UI_UX: sempre feedback após ações; nunca alert()). */
export function useNotify() {
  return {
    success(message: string) {
      Notify.create({ type: 'positive', message, icon: 'sym_o_check_circle' });
    },
    info(message: string) {
      Notify.create({ type: 'info', message, icon: 'sym_o_info' });
    },
    warn(message: string) {
      Notify.create({ type: 'warning', message, icon: 'sym_o_warning' });
    },
    error(error: unknown, fallback?: string) {
      Notify.create({ type: 'negative', message: apiErrorMessage(error, fallback), icon: 'sym_o_error' });
    },
  };
}
