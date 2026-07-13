<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div class="auth-wrap">
        <!-- Painel de marca -->
        <aside class="auth-brand brand-gradient">
          <div class="auth-brand__inner">
            <img :src="markDark" alt="Conecta" class="auth-brand__mark" />
            <h1 class="auth-brand__title">Atendimento inteligente.<br />Relacionamento que gera resultados.</h1>
            <p class="auth-brand__sub">A plataforma de Atendimento Omnichannel, CRM e Gestão Comercial da indústria cerâmica.</p>

            <ul class="auth-brand__features">
              <li v-for="f in features" :key="f.label">
                <q-icon :name="f.icon" size="20px" />
                <span>{{ f.label }}</span>
              </li>
            </ul>
          </div>
          <div class="auth-brand__glow" />
        </aside>

        <!-- Formulário -->
        <main class="auth-form">
          <router-view />
        </main>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import markDark from '@/assets/mark-dark.png';

const features = [
  { icon: 'sym_o_forum', label: 'Atendimento Omnichannel' },
  { icon: 'sym_o_groups', label: 'CRM ' },
  { icon: 'sym_o_view_kanban', label: 'Pipeline e Funis de venda' },
  { icon: 'sym_o_trending_up', label: 'Gestão e Resultados' },
];
</script>

<style scoped>
.auth-wrap { display: grid; grid-template-columns: 1.05fr 1fr; min-height: 100vh; }
.auth-brand {
  position: relative; overflow: hidden; color: #fff;
  display: flex; align-items: center; padding: 6vh 5vw;
}
.auth-brand__inner { position: relative; z-index: 2; max-width: 460px; }
.auth-brand__mark { width: 76px; height: auto; margin-bottom: 26px; filter: drop-shadow(0 6px 18px rgba(0,0,0,.25)); }
.auth-brand__title {
  font-family: 'Exo 2', sans-serif; font-weight: 700; font-size: clamp(24px, 2.6vw, 34px);
  line-height: 1.18; margin: 0 0 14px; letter-spacing: -.01em; text-wrap: balance;
}
.auth-brand__sub { font-size: 15px; opacity: .92; margin: 0 0 30px; max-width: 42ch; }
.auth-brand__features { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.auth-brand__features li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
.auth-brand__features .q-icon {
  background: rgba(255,255,255,.16); border-radius: 10px; padding: 7px; backdrop-filter: blur(4px);
}
.auth-brand__glow {
  position: absolute; inset: -30% -40% auto auto; width: 70%; height: 120%;
  background: radial-gradient(circle at 70% 30%, rgba(255,255,255,.28), transparent 60%);
  z-index: 1;
}
.auth-form { display: flex; align-items: center; justify-content: center; padding: 6vh 5vw; background: var(--surface-2); }

@media (max-width: 900px) {
  .auth-wrap { grid-template-columns: 1fr; }
  .auth-brand { display: none; }
  .auth-form { min-height: 100vh; }
}
</style>
