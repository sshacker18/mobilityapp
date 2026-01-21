#!/bin/sh
set -eu

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Starting local stack via docker-compose..."
./scripts/compose-up.sh

echo "Running database migrations inside backend container..."
echo "If your backend exposes a migration script, it will run below."
docker-compose exec backend sh -c "npx prisma migrate deploy || echo 'Run prisma migrate manually if needed'"

echo "Local stack started. Tail logs with: docker-compose logs -f"
