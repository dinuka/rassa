FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile --offline
ARG APP
RUN pnpm --filter=$APP build

FROM base AS runner
COPY --from=builder /app/apps/$APP/.next .next
COPY --from=builder /app/apps/$APP/public public
COPY --from=builder /app/apps/$APP/package.json .
EXPOSE 3000
CMD ["pnpm", "start"]
