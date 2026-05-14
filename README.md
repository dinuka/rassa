# GenAI SaaS

AI-powered recruitment platform — monorepo.

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Python >= 3.12
- uv
- Docker & Docker Compose

## Quick start

```bash
pnpm install
pnpm dev
```

## Structure

```
apps/
  candidate-portal/    Next.js — job seekers
  company-portal/      Next.js — recruiters
  admin/               Next.js — internal admin
  backend/             NestJS — core API
  ai-service/          Python FastAPI — AI/RAG
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
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all workspaces |
| `pnpm test` | Run all tests |
| `pnpm typecheck` | Type-check all workspaces |
