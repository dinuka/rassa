# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Start infrastructure (MongoDB, Redis, Qdrant, MinIO, Ollama)
docker compose -f infra/docker-compose.dev.yml up -d

# Dev — all apps
pnpm dev

# Build / lint / typecheck — all apps
pnpm build
pnpm lint
pnpm typecheck

# Format
pnpm format

# Test — all workspaces
pnpm test

# Test / dev — single app
pnpm --filter @rassa/backend test
pnpm --filter @rassa/candidate-portal dev

# Backend: run a single spec file
pnpm --filter @rassa/backend test -- --testPathPattern="app.module"

# AI service (Python)
cd apps/ai-service && uv run pytest         # run tests
cd apps/ai-service && uv run ruff check .   # lint
```

## Architecture

pnpm workspace monorepo orchestrated with Turborepo. All builds respect dependency order (`^build`).

### Apps

| App                     | Stack                       | Port | Purpose                                    |
| ----------------------- | --------------------------- | ---- | ------------------------------------------ |
| `apps/candidate-portal` | Next.js 16, NextAuth v5     | 3000 | Job-seeker UI                              |
| `apps/company-portal`   | Next.js 16                  | 3001 | Recruiter UI                               |
| `apps/admin`            | Next.js 16                  | 3002 | Internal admin                             |
| `apps/backend`          | NestJS 11, Mongoose, BullMQ | 4000 | Core REST API (Swagger at `/api`)          |
| `apps/ai-service`       | FastAPI 0.115, Python ≥3.12 | 8000 | AI/RAG — embeddings, matching, CV analysis |

### Packages

| Package                 | Role                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `@repo/shared-types`    | Single source of truth: Zod schemas; TS types inferred from them                     |
| `@repo/api-client`      | Typed REST client — the **only** package that knows both backend and AI service URLs |
| `@repo/ui`              | shadcn-style component library                                                       |
| `@repo/ai-sdk`          | Vercel AI SDK wrappers + streaming hooks                                             |
| `@repo/auth`            | JWT token helpers (localStorage)                                                     |
| `@repo/tailwind-config` | Shared Tailwind v4 CSS-first theme (`theme.css`)                                     |
| `@repo/eslint-config`   | Shared ESLint presets                                                                |
| `@repo/tsconfig`        | Shared TypeScript base config                                                        |

### Key architectural rules

- **Frontends never call the AI service directly.** All FastAPI calls go through the NestJS `ai-gateway` module.
- **Next.js route handlers are BFF only.** `app/api/ai/stream/route.ts` proxies/streams to NestJS — no business logic lives there.
- **`@repo/api-client`** is the single place where backend and AI service base URLs are configured (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_AI_URL`).
- **`@repo/shared-types`** owns all Zod schemas. Derive TypeScript types from them — never define parallel interfaces.
- **Python dependency management uses `uv` only** — no `pip`, no `poetry`. Pin Python version in `.python-version`.

### Backend structure (`apps/backend/src`)

```
app.module.ts          — root module (ConfigModule, MongooseModule, BullModule)
main.ts                — bootstrap; global prefix "api", CORS from CORS_ORIGIN env var
ai-gateway/            — proxy module for all calls to ai-service
common/
  decorators/
  filters/
  interceptors/
  middleware/
  pipes/
config/
modules/               — feature modules (auth, users, candidates, companies, jobs,
                         applications, interviews, cv-documents, generated-documents,
                         files, billing, workflows)
queues/
schemas/
```

Backend reads env vars from the **root `.env`** file via `ConfigModule.forRoot({ envFilePath: '../../.env' })`.

### Next.js portals structure

Route groups follow Next.js App Router conventions:

- `(auth)` — sign-in / register pages (unauthenticated)
- `(dashboard)` — main app routes (authenticated)
- `(onboarding)` — first-run setup flow
- `app/api/` — BFF route handlers only; talk to NestJS, not directly to MongoDB or ai-service

`candidate-portal` uses NextAuth v5 with Google + LinkedIn OAuth providers. Auth is configured in `lib/auth.config.ts` and instantiated in `lib/auth.ts` (MongoDB adapter, JWT session strategy). New users get `onboardingComplete: false` set on creation.

### Styling

Tailwind CSS v4, CSS-first config. **No `tailwind.config.ts` files exist.** Each portal's `globals.css` uses `@import "tailwindcss"`. The shared theme is imported from `@repo/tailwind-config/theme.css`.

### AI service structure (`apps/ai-service/app`)

```
main.py           — FastAPI app; routers mounted at /api/cv, /api/job, /api/generate,
                    /api/interview, /api/application
api/v1/           — endpoint modules (cv, matching, generation, interview, evaluation)
core/             — shared services
document_processing/
llm/
matching/
prompts/
retrieval/
schemas/
services/
utils/
workflows/
models/           — gitignored; download via scripts/download-models.sh
```
