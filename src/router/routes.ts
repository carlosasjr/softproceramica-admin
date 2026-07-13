import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [{ path: '', name: 'login', component: () => import('@/pages/auth/LoginPage.vue') }],
  },

  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'tenants' } },
      { path: 'tenants', name: 'tenants', component: () => import('@/pages/tenants/TenantsListPage.vue') },
      { path: 'tenants/novo', name: 'tenant-novo', component: () => import('@/pages/tenants/TenantProvisionPage.vue') },
      { path: 'tenants/:id', name: 'tenant', component: () => import('@/pages/tenants/TenantDetailPage.vue'), props: true },
      { path: 'leads', name: 'leads', component: () => import('@/pages/leads/LeadsListPage.vue') },
      { path: 'leads/:id', name: 'lead', component: () => import('@/pages/leads/LeadDetailPage.vue'), props: true },
    ],
  },

  { path: '/:catchAll(.*)*', component: () => import('@/pages/ErrorNotFound.vue') },
];

export default routes;
