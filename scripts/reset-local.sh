#!/usr/bin/env bash
set -euo pipefail

echo "WARNING: This will reset all local data!"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then exit 1; fi

docker compose -f infra/docker-compose.dev.yml down -v
docker compose -f infra/docker-compose.dev.yml up -d mongodb redis qdrant minio

echo "Waiting for services..."
sleep 5

pnpm tsx scripts/seed-mongo.ts
uv run python scripts/seed-qdrant.py

echo "Local reset complete"
