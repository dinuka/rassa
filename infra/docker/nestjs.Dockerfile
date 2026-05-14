FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile --offline
RUN pnpm --filter=@rassa/backend build

FROM base AS runner
COPY --from=builder /app/apps/backend/dist dist
COPY --from=builder /app/apps/backend/package.json .
EXPOSE 4000
CMD ["node", "dist/main"]
