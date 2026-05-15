# Rassa SaaS

AI-powered recruitment platform — monorepo.

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Python >= 3.12
- uv
- Docker & Docker Compose

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file (edit as needed)
cp .env.example .env

# 3. Start infrastructure (MongoDB, Redis, Qdrant, MinIO, Ollama)
docker compose -f infra/docker-compose.dev.yml up -d

# 4. Start all apps in dev mode
pnpm dev
```

> **Note:** The backend reads environment variables from the root `.env` file via `ConfigModule.forRoot({ envFilePath: '../../.env' })`.

## Structure

```
apps/
  candidate-portal/    Next.js — job seekers (port 3000)
  company-portal/      Next.js — recruiters (port 3001)
  admin/               Next.js — internal admin (port 3002)
  backend/             NestJS — core API (port 4000)
  ai-service/          Python FastAPI — AI/RAG (port 8000)
packages/
  ui/                  shadcn components
  ai-sdk/              Vercel AI SDK wrappers
  auth/                shared auth client
  shared-types/        Zod schemas + TS types
  api-client/          typed REST client
  eslint-config/
  tsconfig/
  tailwind-config/
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode via Turbo |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all workspaces |
| `pnpm test` | Run all tests |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm format` | Format code with Prettier |
| `docker compose -f infra/docker-compose.dev.yml up -d` | Start infra services (Mongo, Redis, Qdrant, MinIO, Ollama) |

## Testing

### Automated tests

```bash
# Run all tests
pnpm test

# Run tests for a specific app
pnpm --filter @rassa/backend test
pnpm --filter @rassa/candidate-portal test
```

### Manual testing (local)

After running `pnpm dev`, access each app in your browser:

| App | URL | Description |
|-----|-----|-------------|
| Candidate Portal | <http://localhost:3000> | Job seeker interface — browse jobs, apply, track applications |
| Company Portal | <http://localhost:3001> | Recruiter dashboard — post jobs, review candidates |
| Admin | <http://localhost:3002> | Internal admin panel — manage users, settings |
| Backend API | <http://localhost:4000> | NestJS REST API (Swagger at /api) |
| AI Service | <http://localhost:8000> | FastAPI health check at /health |

To test a specific flow (e.g. candidate registration + job application), open the Candidate Portal and Company Portal side by side.

## Architecture notes

- All FastAPI calls go through NestJS (`ai-gateway` module) — frontends never call Python directly.
- Next.js route handlers (`app/api/ai/stream/route.ts`) are BFF-only: they proxy/stream to NestJS.
- `@repo/api-client` is the only package that knows about both backend URLs.
- `@repo/shared-types` owns Zod schemas; TS types are inferred from them.
- Python managed by `uv` — no `pip` or `poetry`. Pin Python in `.python-version`.
- Tailwind CSS is v4 with CSS-first config — `globals.css` uses `@import "tailwindcss"`, no `tailwind.config.ts`.
- Models (BGE embeddings, reranker) live in `apps/ai-service/models/`, gitignored. Download with `apps/ai-service/scripts/download-models.sh`.
