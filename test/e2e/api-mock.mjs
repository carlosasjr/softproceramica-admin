// Mock determinístico da API de operador (Control Plane, ADR-024) — e2e sem backend.
// Intercepta **/api/** e responde fixtures estáveis para os screenshots.

const operator = { id: 1, name: 'Ana Operadora', email: 'ops@conectaceramica.com.br' };

const tenants = [
  { id: 't-alfa-0001', name: 'Cerâmica Alfa', slug: 'alfa', status: 'active', plan: { slug: 'pro', name: 'Pro' }, created_at: '2026-05-12T13:00:00Z', updated_at: '2026-05-12T13:02:00Z' },
  { id: 't-beta-0002', name: 'Revestimentos Beta', slug: 'beta', status: 'active', plan: { slug: 'trial', name: 'Trial' }, created_at: '2026-06-01T09:30:00Z', updated_at: '2026-06-01T09:31:00Z' },
  { id: 't-gama-0003', name: 'Porcelanato Gama', slug: 'gama', status: 'provisioning', plan: { slug: 'trial', name: 'Trial' }, created_at: '2026-07-13T11:00:00Z', updated_at: '2026-07-13T11:00:20Z' },
];

const run = { id: 9, tenant_id: 't-alfa-0001', status: 'ready', step: 'done', error: null, created_at: '2026-05-12T13:00:00Z', updated_at: '2026-05-12T13:02:00Z' };

const leads = [
  { id: 1, nome: 'Marcos Telha', empresa: 'Telha Norte Revestimentos', email: 'marcos@telhanorte.test', telefone: '5548999990001', cidade: 'Criciúma', uf: 'SC', segmento: 'industria-ceramica', porte: 'medio', mensagem: 'Queremos centralizar o atendimento e o comercial.', plano_slug: 'pro', origem: 'contato', consent: true, attribution: { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'demo' }, status: 'qualificado', tenant_id: null, converted_at: null, created_at: '2026-07-10T14:20:00Z' },
  { id: 2, nome: 'Júlia Barros', empresa: 'Distribuidora Barros', email: 'julia@barros.test', telefone: '5511988887777', cidade: 'São Paulo', uf: 'SP', segmento: 'revendas', porte: 'grande', mensagem: null, plano_slug: null, origem: 'planos', consent: true, attribution: { utm_source: 'linkedin' }, status: 'novo', tenant_id: null, converted_at: null, created_at: '2026-07-12T10:05:00Z' },
  { id: 3, nome: 'Pedro Rocha', empresa: null, email: 'pedro@rep.test', telefone: null, cidade: 'Curitiba', uf: 'PR', segmento: 'representantes', porte: null, mensagem: 'Sou representante e atendo várias cerâmicas.', plano_slug: null, origem: 'contato', consent: true, attribution: {}, status: 'em_contato', tenant_id: null, converted_at: null, created_at: '2026-07-12T16:40:00Z' },
  { id: 4, nome: 'Sônia Lima', empresa: 'Cerâmica Sul', email: 'sonia@ceramicasul.test', telefone: '5551999992222', cidade: 'Porto Alegre', uf: 'RS', segmento: 'industria-ceramica', porte: 'medio', mensagem: null, plano_slug: 'pro', origem: 'contato', consent: true, attribution: { utm_source: 'google' }, status: 'convertido', tenant_id: 't-alfa-0001', converted_at: '2026-05-12T13:02:00Z', created_at: '2026-04-30T08:00:00Z' },
];

const plans = [
  { slug: 'trial', name: 'Trial', description: '14 dias', price_amount: 0, currency: 'BRL', billing_period: 'mensal', highlight: false, display_order: 1 },
  { slug: 'pro', name: 'Pro', description: 'Operação completa', price_amount: 49000, currency: 'BRL', billing_period: 'mensal', highlight: true, display_order: 2 },
];

const json = (route, body, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

const paginated = (data) => ({ data, meta: { current_page: 1, last_page: 1, total: data.length, per_page: 20 } });

export async function installMocks(ctx) {
  await ctx.route('**/api/**', async (route) => {
    const req = route.request();
    const method = req.method();
    const path = new URL(req.url()).pathname.replace(/^.*\/api\//, '/');

    if (path === '/platform/auth/login' && method === 'POST') return json(route, { token: 'e2e-mock-token', user: operator });
    if (path === '/platform/auth/logout') return json(route, { ok: true });
    if (path === '/platform/me') return json(route, { user: operator });

    if (path === '/platform/tenants' && method === 'GET') return json(route, paginated(tenants));
    if (path === '/platform/tenants' && method === 'POST') return json(route, { slug: 'nova', status: 'queued', admin_email: 'admin@nova.test', admin_password: 'Ab3-Kf9-Zq2x' }, 202);
    if (/^\/platform\/tenants\/[^/]+\/provisioning$/.test(path)) return json(route, { status: 'active', tenant: tenants[0], run });
    if (/^\/platform\/tenants\/[^/]+$/.test(path)) return json(route, { data: tenants[0], provisioning: run });

    if (path === '/platform/leads' && method === 'GET') return json(route, paginated(leads));
    if (/^\/platform\/leads\/\d+$/.test(path) && method === 'GET') {
      const id = Number(path.split('/').pop());
      return json(route, { data: leads.find((l) => l.id === id) ?? leads[0] });
    }
    if (/^\/platform\/leads\/\d+$/.test(path) && method === 'PATCH') {
      const id = Number(path.split('/').pop());
      const body = JSON.parse(req.postData() || '{}');
      return json(route, { data: { ...(leads.find((l) => l.id === id) ?? leads[0]), status: body.status } });
    }

    if (path === '/platform/plans') return json(route, { data: plans });

    return json(route, { message: 'mock: rota não mapeada' }, 404);
  });
}
