# Bun Monorepo Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a bare-bones Bun monorepo with Turborepo, Hono server, TanStack Start web app, and a UI package — all targeting Cloudflare Workers for deployment.

**Architecture:** Bun workspaces with Turborepo orchestration. Root package.json uses Bun catalog for shared dependency versions. Apps in `apps/`, packages in `packages/`. Bun is the dev/build tool; Cloudflare Workers is the deployment target.

**Tech Stack:** Bun 1.3+, Turborepo, Hono, TanStack Start (React), TypeScript

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `package.json` | Root: workspaces, catalog, turbo devDep |
| Create | `turbo.json` | Turborepo task pipelines |
| Create | `tsconfig.json` | Base TypeScript config |
| Create | `.gitignore` | Ignore node_modules, dist, .turbo, etc. |
| Create | `packages/ui/package.json` | @repo/ui workspace |
| Create | `packages/ui/tsconfig.json` | Extends root tsconfig |
| Create | `packages/ui/src/index.ts` | Empty barrel export |
| Create | `apps/server/package.json` | @repo/server workspace |
| Create | `apps/server/tsconfig.json` | Extends root tsconfig |
| Create | `apps/server/src/index.ts` | Hono app with health route |
| Create | `apps/web/package.json` | @repo/web workspace |
| Create | `apps/web/tsconfig.json` | Extends root tsconfig |
| Create | `apps/web/vite.config.ts` | TanStack Start + Vite config |
| Create | `apps/web/src/router.tsx` | Router initialization |
| Create | `apps/web/src/routes/__root.tsx` | Root layout |
| Create | `apps/web/src/routes/index.tsx` | Home page route |

---

### Task 1: Initialize git repo and root config files

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/AT/Developer/personal/my-starter
git init
```

- [ ] **Step 2: Create root package.json**

```json
{
  "name": "my-starter",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2",
    "typescript": "catalog:"
  },
  "catalog": {
    "typescript": "^5.8",
    "react": "^19",
    "react-dom": "^19",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "hono": "^4",
    "vite": "^6",
    "@vitejs/plugin-react": "^4"
  }
}
```

- [ ] **Step 3: Create turbo.json**

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 5: Create .gitignore**

```
node_modules
dist
.turbo
bun.lock
*.tsbuildinfo
.DS_Store
```

- [ ] **Step 6: Commit**

```bash
git add package.json turbo.json tsconfig.json .gitignore
git commit -m "chore: initialize monorepo root with bun workspaces and turborepo"
```

---

### Task 2: Create packages/ui

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: Create packages/ui/package.json**

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 2: Create packages/ui/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/ui/src/index.ts**

```typescript
// @repo/ui — placeholder for UI components (shadcn)
export {};
```

- [ ] **Step 4: Commit**

```bash
git add packages/ui
git commit -m "chore: add @repo/ui package scaffold"
```

---

### Task 3: Create apps/server (Hono)

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/src/index.ts`

- [ ] **Step 1: Create apps/server/package.json**

```json
{
  "name": "@repo/server",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "build": "bun build src/index.ts --outdir dist --target browser",
    "start": "bun src/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "hono": "catalog:"
  },
  "devDependencies": {
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 2: Create apps/server/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
```

- [ ] **Step 3: Create apps/server/src/index.ts**

```typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ ok: true });
});

export default app;
```

- [ ] **Step 4: Verify locally**

```bash
cd /Users/AT/Developer/personal/my-starter
bun install
bun run --filter=@repo/server dev
# In another terminal: curl http://localhost:3000
# Expected: {"ok":true}
```

- [ ] **Step 5: Commit**

```bash
git add apps/server
git commit -m "chore: add @repo/server with hono"
```

---

### Task 4: Create apps/web (TanStack Start)

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/src/router.tsx`
- Create: `apps/web/src/routes/__root.tsx`
- Create: `apps/web/src/routes/index.tsx`

- [ ] **Step 1: Create apps/web/package.json**

```json
{
  "name": "@repo/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@tanstack/react-router": "^1",
    "@tanstack/react-start": "^1",
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@vitejs/plugin-react": "catalog:",
    "typescript": "catalog:",
    "vite": "catalog:"
  }
}
```

- [ ] **Step 2: Create apps/web/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 3: Create apps/web/vite.config.ts**

```typescript
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: { port: 3001 },
  plugins: [tanstackStart(), react()],
});
```

- [ ] **Step 4: Create apps/web/src/router.tsx**

```tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({ routeTree, scrollRestoration: true });
}
```

- [ ] **Step 5: Create apps/web/src/routes/__root.tsx**

```tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}
```

- [ ] **Step 6: Create apps/web/src/routes/index.tsx**

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <h1>Hello World</h1>;
}
```

- [ ] **Step 7: Verify locally**

```bash
cd /Users/AT/Developer/personal/my-starter
bun install
bun run --filter=@repo/web dev
# Open http://localhost:3001 — should show "Hello World"
```

- [ ] **Step 8: Commit**

```bash
git add apps/web
git commit -m "chore: add @repo/web with tanstack start"
```

---

### Task 5: Install dependencies and full verification

- [ ] **Step 1: Run bun install at root**

```bash
cd /Users/AT/Developer/personal/my-starter
bun install
```

Expected: installs all workspace deps, creates bun.lock

- [ ] **Step 2: Verify turbo dev runs both apps**

```bash
bunx turbo dev
```

Expected: both server (port 3000) and web (port 3001) start concurrently

- [ ] **Step 3: Verify turbo typecheck**

```bash
bunx turbo typecheck
```

Expected: all workspaces pass type checking

- [ ] **Step 4: Verify turbo build**

```bash
bunx turbo build
```

Expected: all workspaces build without errors

- [ ] **Step 5: Commit lockfile**

```bash
git add bun.lock
git commit -m "chore: add lockfile"
```
