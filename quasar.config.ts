import { defineConfig } from '@quasar/app-vite/wrappers';
import { fileURLToPath } from 'node:url';

// Console Administrativo do Control Plane (ADR-024). Realm de operador: sem tenancy, sem Reverb.
// Boot: axios (instância + interceptors) → auth (hidrata sessão do operador).
export default defineConfig(() => {
  return {
    boot: ['axios', 'auth'],
    css: ['app.scss'],
    extras: ['material-symbols-outlined'], // conjunto oficial de ícones (ADR-014)

    build: {
      target: { browser: ['es2022', 'firefox115', 'chrome115', 'safari14'], node: 'node20' },
      typescript: { strict: true, vueShim: true },
      vueRouterMode: 'history',
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },

    devServer: { open: false, port: 9200 }, // ≠ 9100 (app) / 3100 (land)

    framework: {
      iconSet: 'material-symbols-outlined',
      config: {
        dark: 'auto',
        brand: {
          primary: '#F58220',
          secondary: '#4A4A4A',
          accent: '#E86A0C',
          dark: '#1b1f24',
          'dark-page': '#14171b',
          positive: '#16a34a',
          negative: '#e5484d',
          info: '#3b82f6',
          warning: '#f59e0b',
        },
        loadingBar: { color: 'primary', size: '3px' },
        notify: { position: 'top-right', timeout: 3200, textColor: 'white' },
      },
      plugins: ['Notify', 'Dialog', 'Loading', 'LoadingBar', 'Dark', 'Meta'],
    },

    animations: [],
  };
});
