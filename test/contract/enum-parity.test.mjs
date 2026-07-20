// Guardrail G-2 (ADR-028 §11) — contrato de Enums backend ↔ tipos frontend do `admin`.
// Descobre automaticamente os enums espelhados por NOME: para todo `enum X: string`
// do backend que também exista como `export type X = '...' | '...'` em `src/types`, os
// CONJUNTOS de valores têm de bater 1:1. Se o backend renomear um `case` (ex.: valor
// PT→EN) e o admin não acompanhar (ou vice-versa), este teste falha — pega o drift
// silencioso do espelho do Control Plane (TenantStatus/ProvisioningStatus/PlatformLeadStatus).
// Uso: `node test/contract/enum-parity.test.mjs`.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BACKEND_ENUMS = join(here, '..', '..', '..', 'backend', 'app');
const FRONT_TYPES = join(here, '..', '..', 'src', 'types');

let failures = 0;
const fail = (msg) => { failures++; console.error('  ✗', msg); };
const ok = (msg) => console.log('  ✓', msg);

console.log('\nG-2 — paridade de valores Enums backend ↔ tipos do admin\n');

// Repo-only guardrail: sem o checkout do backend ao lado, não há o que comparar.
if (!existsSync(BACKEND_ENUMS)) {
  console.log('  · backend/ ausente (checkout separado) — pulando G-2 (rode no monorepo de dev).');
  process.exit(0);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const norm = (arr) => [...new Set(arr)].sort();

// --- backend: enum X: string { case A = 'a'; ... } ---
const backend = {};
for (const file of walk(BACKEND_ENUMS)) {
  if (!file.endsWith('.php')) continue;
  const src = readFileSync(file, 'utf8');
  const m = src.match(/enum\s+(\w+)\s*:\s*string/);
  if (!m) continue;
  const values = [...src.matchAll(/case\s+\w+\s*=\s*'([^']+)'/g)].map((x) => x[1]);
  if (values.length) backend[m[1]] = norm(values);
}

// --- admin: export type X = 'a' | 'b' | ...; ---
const front = {};
for (const file of readdirSync(FRONT_TYPES)) {
  if (!file.endsWith('.ts')) continue;
  const src = readFileSync(join(FRONT_TYPES, file), 'utf8');
  for (const m of src.matchAll(/export\s+type\s+(\w+)\s*=\s*([^;]+);/g)) {
    const rhs = m[2];
    const values = [...rhs.matchAll(/'([^']+)'/g)].map((x) => x[1]);
    if (values.length) front[m[1]] = norm(values);
  }
}

const mirrored = Object.keys(backend).filter((name) => name in front);
if (mirrored.length === 0) {
  fail('nenhum enum espelhado encontrado — extração provavelmente quebrou');
}

for (const name of mirrored.sort()) {
  const b = backend[name].join(',');
  const f = front[name].join(',');
  if (b === f) ok(`${name}: [${b}]`);
  else fail(`${name}: backend [${b}] ≠ admin [${f}]`);
}

console.log(`\n${mirrored.length} enums espelhados verificados; ${failures} divergência(s).\n`);
process.exit(failures ? 1 : 0);
