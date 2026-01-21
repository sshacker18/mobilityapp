#!/bin/sh
# Start docker-compose services with .env handling and migration hint
set -eu

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Starting docker-compose services..."
docker-compose up -d --build

echo "Waiting a few seconds for services to initialize..."
sleep 5

echo "IMPORTANT: Run database migrations after the database is ready. Example:"
echo "  docker-compose exec backend npx prisma migrate deploy"
echo "Or run migration locally against DATABASE_URL."

echo "To tail logs: docker-compose logs -f"
