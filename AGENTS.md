# AGENTS.md

## Structure

pnpm workspace monorepo with Turborepo.

```
apps/
  candidate-portal/   Next.js 16 — job seekers (port 3000)
  company-portal/     Next.js 16 — recruiters (port 3001)
  admin/              Next.js 16 — internal admin (port 3002)
  backend/            NestJS 11 — core API (port 4000)
  ai-service/         Python FastAPI 0.115 — AI/RAG (port 8000)
packages/
  ui/                 shadcn-style components
  ai-sdk/             Vercel AI SDK wrappers + streaming hooks
  auth/               JWT token helpers (localStorage)
  shared-types/       Zod schemas (source of truth for types)
  api-client/         Typed REST client wrapping backend + AI service
  eslint-config/      Shared ESLint configs (base, next)
  tsconfig/           Shared TS config (base.json)
  tailwind-config/    Shared Tailwind v4 theme (CSS-first config)
```

## Remote

- `origin`: `git@github-dinuka:dinuka/rassa.git`

## Commands

| Command | What |
|---------|------|
| `pnpm dev` | Start all apps in dev mode via Turbo |
| `pnpm build` | Build all |
| `pnpm lint` | Lint all |
| `pnpm test` | Test all |
| `pnpm typecheck` | Typecheck all |
| `pnpm format` | Prettier |
| `docker compose -f infra/docker-compose.dev.yml up -d` | Start infra (Mongo, Redis, Qdrant, MinIO, Ollama) |

## Architecture notes

- All FastAPI calls go through NestJS `ai-gateway` module — frontends never call Python directly.
- Next.js route handlers (`app/api/ai/stream/route.ts`) are BFF-only: they proxy/stream to NestJS.
- `@repo/api-client` is the only package that knows about both backend URLs.
- `@repo/shared-types` owns Zod schemas; TS types are inferred from them.
- Python managed by `uv` — no `pip` or `poetry`. Pin Python in `.python-version`.
- Tailwind CSS is v4 with CSS-first config — `globals.css` uses `@import "tailwindcss"`, no `tailwind.config.ts` files exist. Shared theme at `@repo/tailwind-config/theme.css`.
- The `ai-service/package.json` is a thin wrapper so Turbo can orchestrate the Python app alongside JS ones.
- Models (BGE embeddings, reranker) live in `apps/ai-service/models/`, gitignored, downloaded via `scripts/download-models.sh`.

## Setup flow

```bash
pnpm install
docker compose -f infra/docker-compose.dev.yml up -d
pnpm dev
```

## Coding Conventions

### Naming

| What | Convention |
| ---- | ---------- |
| Folders | camelCase |
| Page folders | kebab-case |
| React component files | PascalCase.tsx |
| Style component files | PascalCase.tsx |
| Util function files | camelCase.ts |
| GraphQL files | camelCase.ts |
| Types file | `types.ts` |
| GraphQL gql names | `SNAKE_CASE` |
| API routes | camelCase |
| FE routes | kebab-case |

### Module Exports

`export default` only when the exported name matches the file name. Otherwise named exports.

### Rules

- Arrow functions only — no `function` keyword
- `const`/`let` — no `var`
- `import` — no `require`
- No `any`
- Prefer enums
- Extend GQL-generated types via `Pick`/`Omit` instead of redefining
- Destructure early
- No `?.` on mandatory fields, no `?` on mandatory properties
- Check parent once instead of repeating `?.` everywhere
- Prefer `forEach` over chained `filter().map()`
- Declare variables near point of use
