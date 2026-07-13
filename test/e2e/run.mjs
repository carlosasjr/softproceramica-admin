// Orquestra os screenshots E2E do Console Admin: serve dist/spa e roda o driver.
// Uso: node test/e2e/run.mjs  (requer build prévio: npm run build).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { capture } from './drive.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const dist = join(root, 'dist/spa');
const PORT = Number(process.env.PORT || 9223);
const outDir = join(__dirname, 'screenshots', 'admin');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('✗ dist/spa não encontrado. Rode primeiro:  npm run build');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.map': 'application/json',
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = join(dist, urlPath);
    let ext = extname(filePath);
    if (!ext || !existsSync(filePath) || (await stat(filePath)).isDirectory()) {
      filePath = join(dist, 'index.html');
      ext = '.html';
    }
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});

await new Promise((r) => server.listen(PORT, r));
const app = `http://localhost:${PORT}`;
console.log('▶ E2E screenshots — Console Admin');
console.log(`  server: ${app}  →  ${outDir}`);

try {
  const { errors } = await capture({ app, outDir });
  console.log('✓ Screenshots salvos em', outDir);
  if (errors?.length) process.exitCode = 1;
} catch (e) {
  console.error('✗ Falha no driver:', e.message);
  process.exitCode = 1;
} finally {
  server.close();
}
