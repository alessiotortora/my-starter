# Bun Monorepo with Turborepo — Design Spec

## Context

Setting up a production-ready monorepo starter using Bun workspaces, Turborepo, and the Bun catalog feature. The goal is a minimal but well-structured foundation that can be incrementally built upon for enterprise applications.

## Structure

```
my-starter/
├── package.json            # root: bun workspaces, catalog, turbo devDep
├── bun.lock
├── turbo.json              # turborepo pipeline config
├── tsconfig.json           # base tsconfig extended by all workspaces
├── .gitignore
├── apps/
│   ├── server/
│   │   ├── package.json    # @repo/server
│   │   ├── tsconfig.json   # extends ../../tsconfig.json
│   │   └── src/
│   │       └── index.ts    # minimal Hono server with health route
│   └── web/
│       ├── package.json    # @repo/web
│       ├── tsconfig.json   # extends ../../tsconfig.json
│       └── app/            # TanStack Start app directory
│           ├── routes/
│           │   └── index.tsx  # minimal home route
│           └── ...            # TanStack Start scaffolding
└── packages/
    └── ui/
        ├── package.json    # @repo/ui
        ├── tsconfig.json   # extends ../../tsconfig.json
        └── src/
            └── index.ts    # empty barrel export
```

## Decisions

### Workspace naming: `@repo/*`
All packages use the `@repo/` scope. This is a private namespace — nothing will be published to npm. Cross-workspace imports look like `import { ... } from "@repo/ui"`.

### Bun catalog
Shared dependency versions are pinned once in the root `package.json` under `"catalog"`. Individual workspaces reference catalog entries instead of hardcoding versions, ensuring all workspaces stay on the same version of shared dependencies (e.g., TypeScript, React).

### Turborepo pipelines
`turbo.json` defines these task pipelines:
- `build` — depends on `^build` (build dependencies first)
- `dev` — persistent task, no caching
- `lint` — cacheable
- `typecheck` — cacheable

### Deployment target: Cloudflare Workers
Bun is the local dev/build tool and package manager. The deployment target is Cloudflare Workers. This means:
- No Bun-specific APIs in application code (no `Bun.serve`, no `Bun.file`, etc.)
- Platform-agnostic TypeScript config (no `bun-types`)
- Hono uses portable `export default app` pattern (works on both Bun and CF Workers)
- Wrangler configs will be added later when deployment is set up

### TypeScript
- Single `tsconfig.json` at root with platform-agnostic settings
- Each workspace extends it with `"extends": "../../tsconfig.json"`
- Target: ESNext, Module: ESNext, ModuleResolution: Bundler

### apps/server (Hono)
- Portable Hono server using `export default app` pattern
- Single health check route (`GET /` returns `{ ok: true }`)
- Runs locally with `bun run src/index.ts`, deploys to CF Workers later
- Scripts: `dev` (bun --watch), `build`, `start`

### apps/web (TanStack Start)
- Scaffolded with TanStack Start's recommended structure
- Minimal home route rendering "Hello World"
- Scripts: `dev`, `build`, `start`

### packages/ui
- Empty package with barrel export (`export {}`)
- Placeholder for shadcn components to be added later
- Will depend on React (added when shadcn is set up)

## What is NOT included (intentionally)
- Linting (ESLint/Biome)
- Formatting (Prettier/Biome)
- Testing framework
- CI/CD config
- Docker / deployment
- Environment variable management
- Database setup
- Authentication

All of the above will be added incrementally as requested.

## Verification
1. `bun install` succeeds at root with no errors
2. `bun run dev --filter=@repo/server` starts the Hono server and responds on localhost
3. `bun run dev --filter=@repo/web` starts the TanStack Start dev server
4. `@repo/ui` can be imported from both apps (even if empty)
5. `bunx turbo dev` starts both apps concurrently
6. `bunx turbo build` builds all workspaces in correct dependency order
