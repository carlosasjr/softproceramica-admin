// Driver E2E do Console Admin (playwright-core + Chrome headless). API mockada.
// Loga como operador e percorre as telas do Control Plane (ADR-024), salvando os prints.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { installMocks } from './api-mock.mjs';

const CHROME = process.env.CHROME_BIN || '/usr/bin/google-chrome';

export async function capture({ app, outDir, viewport = { width: 1440, height: 900 } }) {
  mkdirSync(outDir, { recursive: true });
  const errors = [];
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  await installMocks(ctx);

  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  const shot = async (name) => {
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
    console.log('  ✓', name, '→', page.url().replace(app, ''));
  };
  const goto = async (path) => {
    await page.goto(app + path, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
  };

  // 1) Login do operador
  await goto('/login');
  await page.waitForSelector('input[type="email"]', { timeout: 20000 });
  await shot('01-login');
  await page.fill('input[type="email"]', 'ops@conectaceramica.com.br');
  await page.fill('input[type="password"]', 'secret123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/tenants', { timeout: 15000 }).catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});
  await shot('02-tenants');

  // 2) Detalhe de Tenant (status + run de provisionamento)
  await goto('/tenants/t-alfa-0001'); await shot('03-tenant-detalhe');

  // 3) Provisionar Tenant (formulário)
  await goto('/tenants/new'); await shot('04-tenant-provisionar');

  // 4) Leads de Plataforma
  await goto('/leads'); await shot('05-leads');

  // 5) Detalhe do Lead (triagem + promoção)
  await goto('/leads/1'); await shot('06-lead-detalhe');

  // 6) Promoção lead → Tenant (formulário pré-preenchido)
  await goto('/tenants/new?lead=1'); await page.waitForTimeout(500); await shot('07-lead-promover');

  // 7) Mobile — lista de Tenants
  await page.setViewportSize({ width: 390, height: 844 });
  await goto('/tenants'); await shot('08-tenants-mobile');

  await browser.close();

  if (errors.length) {
    console.warn('  ⚠ erros de console/página:');
    for (const e of errors.slice(0, 10)) console.warn('    -', e);
  }
  return { errors };
}
