<template>
  <q-layout view="lHh LpR fFf">
    <q-drawer
      v-model="drawer"
      :width="256"
      :breakpoint="1024"
      show-if-above
      class="admin-drawer"
    >
      <div class="admin-drawer__brand">
        <AppBrand :height="28" />
        <span class="admin-drawer__badge">Control Plane</span>
      </div>

      <q-list padding class="admin-nav">
        <q-item
          v-for="item in nav"
          :key="item.name"
          :to="{ name: item.name }"
          clickable
          class="nav-item"
          active-class="nav-item--active"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" size="22px" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-header class="admin-header">
      <q-toolbar>
        <q-btn flat round dense icon="sym_o_menu" class="lt-lg" @click="drawer = !drawer" />
        <q-toolbar-title class="admin-header__title">{{ currentTitle }}</q-toolbar-title>

        <q-btn flat round dense :icon="$q.dark.isActive ? 'sym_o_light_mode' : 'sym_o_dark_mode'" @click="toggleDark" />

        <q-btn flat round dense class="q-ml-sm">
          <q-avatar size="34px" color="primary" text-color="white">{{ auth.initials }}</q-avatar>
          <q-menu anchor="bottom right" self="top right">
            <div class="admin-user">
              <div class="admin-user__name">{{ auth.user?.name ?? 'Operador' }}</div>
              <div class="admin-user__email">{{ auth.user?.email }}</div>
            </div>
            <q-separator />
            <q-list style="min-width: 180px">
              <q-item v-close-popup clickable @click="logout">
                <q-item-section avatar><q-icon name="sym_o_logout" /></q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade-up" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dark, useQuasar } from 'quasar';
import AppBrand from '@/components/AppBrand.vue';
import { useAuthStore } from '@/stores/auth';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const drawer = ref(false);

const nav = [
  { name: 'tenants', label: 'Tenants', icon: 'sym_o_domain' },
  { name: 'leads', label: 'Leads', icon: 'sym_o_contact_mail' },
];

const titles: Record<string, string> = {
  tenants: 'Tenants',
  'tenant-new': 'Provisionar Tenant',
  tenant: 'Detalhe do Tenant',
  leads: 'Leads de Plataforma',
  lead: 'Detalhe do Lead',
};

const currentTitle = computed(() => titles[String(route.name)] ?? 'Console');

function toggleDark() {
  Dark.toggle();
  localStorage.setItem('conecta_dark', String(Dark.isActive));
}

async function logout() {
  await auth.logout();
  void router.replace({ name: 'login' });
}
</script>

<style scoped>
.admin-drawer { background: var(--surface); border-right: 1px solid var(--border); }
.admin-drawer__brand {
  display: flex; align-items: center; gap: 10px;
  height: var(--header-h, 60px); padding: 0 18px; border-bottom: 1px solid var(--border);
}
.admin-drawer__badge {
  font-size: 10px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  color: var(--brand-700); background: var(--brand-050); padding: 2px 7px; border-radius: var(--radius-pill, 999px);
}
.admin-header {
  background: var(--surface); color: var(--ink);
  border-bottom: 1px solid var(--border); box-shadow: none;
}
.admin-header__title { font-family: var(--font-brand); font-weight: 600; font-size: 17px; }
.admin-user { padding: 12px 16px; }
.admin-user__name { font-weight: 600; color: var(--ink); }
.admin-user__email { font-size: 12.5px; color: var(--ink-2); }

.fade-up-enter-active, .fade-up-leave-active { transition: opacity .18s ease, transform .18s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(6px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
