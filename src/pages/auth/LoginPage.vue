<template>
  <q-page class="login-page">
    <div class="login-card">
      <div class="login-card__brand">
        <AppBrand :height="38" />
      </div>

      <div class="login-card__head">
        <h2 class="login-card__title text-center">Console da Plataforma</h2>
        <p class="login-card__sub">Acesso restrito a operadores do Control Plane.</p>
      </div>

      <q-form class="q-gutter-md" @submit.prevent="submit">
        <q-input
          v-model="email"
          type="email"
          label="E-mail"
          outlined
          autofocus
          lazy-rules
          :rules="[(v) => !!v || 'Informe o e-mail']"
        >
          <template #prepend><q-icon name="sym_o_mail" /></template>
        </q-input>

        <q-input
          v-model="password"
          :type="showPass ? 'text' : 'password'"
          label="Senha"
          outlined
          lazy-rules
          :rules="[(v) => !!v || 'Informe a senha']"
        >
          <template #prepend><q-icon name="sym_o_lock" /></template>
          <template #append>
            <q-icon
              :name="showPass ? 'sym_o_visibility_off' : 'sym_o_visibility'"
              class="cursor-pointer"
              @click="showPass = !showPass"
            />
          </template>
        </q-input>

        <q-btn
          type="submit"
          label="Entrar"
          unelevated
          no-caps
          size="16px"
          color="primary"
          class="full-width login-card__btn"
          :loading="loading"
        >
          <template #loading><q-spinner-dots /></template>
        </q-btn>
      </q-form>

      <div class="login-card__foot text-ink-3">
        <q-icon name="sym_o_shield" size="15px" class="q-mr-xs" />
        Realm de operador · isolado do app de Tenant
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppBrand from '@/components/AppBrand.vue';
import { useAuthStore } from '@/stores/auth';
import { useNotify } from '@/composables/useNotify';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const notify = useNotify();

const email = ref('');
const password = ref('');
const showPass = ref(false);
const loading = ref(false);

async function submit() {
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    notify.success(`Olá, ${auth.user?.name?.split(' ')[0] ?? ''}! 👋`);
    const redirect = (route.query.redirect as string) || undefined;
    void router.replace(redirect ?? { name: 'tenants' });
  } catch (e) {
    notify.error(e, 'Não foi possível entrar. Verifique suas credenciais.');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page { display: flex; align-items: center; justify-content: center; width: 100%; }
.login-card {
  width: 100%; max-width: 400px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 20px; padding: 38px 34px; box-shadow: 0 18px 50px rgba(16, 24, 40, .10);
}
.login-card__brand { display: flex; justify-content: center; margin-bottom: 26px; }
.login-card__title { font-family: 'Exo 2', sans-serif; font-weight: 700; font-size: 22px; margin: 0; color: var(--ink); }
.login-card__sub { color: var(--ink-2); font-size: 14px; margin: 6px 0 24px; text-align: center; }
.login-card__btn { border-radius: 12px; padding: 11px; font-weight: 600; margin-top: 6px; }
.login-card__foot {
  margin-top: 26px; text-align: center; font-size: 12.5px; display: flex; align-items: center; justify-content: center;
}
</style>
