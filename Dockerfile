# ─────────────────────────────────────────────────────
# Console Administrativo do Control Plane (Quasar/Vue SPA) — ADR-024.
# Realm de OPERADOR (guard platform, banco central); NUNCA resolve tenancy/subdomínio.
# Consome a API de operador em /api/platform/* no PRÓPRIO host administrativo.
# Por isso NÃO injetamos VITE_API_URL: em produção o admin auto-deriva a base do host
# (https://admin.conectaceramica.com.br/api — ver src/config/env.ts).
# ─────────────────────────────────────────────────────
ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── runtime: nginx servindo o SPA estático ──
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/spa /usr/share/nginx/html
EXPOSE 80
