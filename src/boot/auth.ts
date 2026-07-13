import { defineBoot } from '@quasar/app-vite/wrappers';
import { Dark } from 'quasar';
import { useAuthStore } from '@/stores/auth';

/**
 * Restaura a sessão (token salvo → /auth/me + permissões) antes de liberar as rotas,
 * e aplica a preferência de tema salva.
 */
export default defineBoot(async ({ store }) => {
  const saved = localStorage.getItem('conecta_dark');
  if (saved !== null) Dark.set(saved === 'true');

  const auth = useAuthStore(store);
  await auth.hydrate();
});
