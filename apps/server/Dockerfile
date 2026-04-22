# syntax=docker/dockerfile:1.7
# Multi-stage build for the Hono server on Bun.
# Target: Railway / Fly / any container host that injects env vars at runtime.
#
# Build from the repo root:
#   docker build -f apps/server/Dockerfile -t my-starter-server .
# Run:
#   docker run --rm -p 3000:3000 --env-file .env my-starter-server

FROM oven/bun:1.3.12-alpine AS base
WORKDIR /app

# --- deps: install once, cached when manifests don't change ---
FROM base AS deps
COPY package.json bun.lock turbo.json bunfig.toml ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/
# --ignore-scripts skips the root `prepare` hook (lefthook install + varlock typegen)
# which is for local dev only and would need git + .env.schema typegen in the image.
RUN bun install --frozen-lockfile --ignore-scripts

# --- builder: bundle the server into a single dist/index.js ---
FROM deps AS builder
COPY . .
RUN bun --filter=@repo/server run build

# --- runner: minimal runtime surface ---
FROM base AS runner
ENV NODE_ENV=production \
    APP_ENV=production \
    PORT=3000

# Only copy the bundled server — `bun build` inlines all workspace + npm deps
# into dist/index.js, so no node_modules needed at runtime.
COPY --from=builder /app/apps/server/dist ./dist

EXPOSE 3000
USER bun

# Env vars (DATABASE_URL, BETTER_AUTH_*, etc.) are injected by the host (Railway).
# Varlock validation runs in dev/CI, not at container start — keep the image lean.
CMD ["bun", "dist/index.js"]
