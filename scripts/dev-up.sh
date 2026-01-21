#!/usr/bin/env bash
set -euo pipefail

# Dev helper: start DB, wait for readiness, optional migrations, build & start backend (compiled)
# Usage:
#   ./scripts/dev-up.sh           # start db, build backend, start server
#   ./scripts/dev-up.sh --migrate # additionally run `npx prisma migrate dev --name init`

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/.."
cd "$REPO_ROOT"

RUN_MIGRATE=0
if [[ ${1-} == "--migrate" ]]; then
  RUN_MIGRATE=1
fi

echo "[dev-up] repo root: $REPO_ROOT"

echo "[dev-up] Starting DB service (db) via docker-compose..."
docker-compose up -d db

echo "[dev-up] Waiting for Postgres to accept connections on localhost:5432..."
READY=0
for i in {1..60}; do
  if command -v nc >/dev/null 2>&1; then
    if nc -z localhost 5432 >/dev/null 2>&1; then
      READY=1
      break
    fi
  else
    # Fallback: check docker container logs for readiness string
    if docker-compose logs db --tail=20 2>/dev/null | grep -q "database system is ready to accept connections"; then
      READY=1
      break
    fi
  fi
  printf "."
  sleep 1
done

if [[ $READY -ne 1 ]]; then
  echo ""
  echo "[dev-up] ERROR: Postgres did not become ready after timeout. Check 'docker-compose logs db'."
  exit 1
fi
echo ""
echo "[dev-up] Postgres is ready."

# Ensure backend dependencies are installed
echo "[dev-up] Installing backend dependencies (npm ci)..."
cd "$REPO_ROOT/backend"
if [[ ! -d node_modules ]]; then
  npm ci
else
  npm install
fi

echo "[dev-up] Building backend (tsc)..."
npm run build

if [[ $RUN_MIGRATE -eq 1 ]]; then
  echo "[dev-up] Running Prisma migrate dev (creates migration) - interactive prompts may appear..."
  # This will prompt if migrations are not present. Use with caution for production data.
  npx prisma migrate dev --name init
fi

# Default DATABASE_URL if not provided in environment or .env
: ${DATABASE_URL:="postgresql://mobility:mobility_pass@localhost:5432/mobility_db"}

LOGFILE="$REPO_ROOT/backend/backend-node.log"
echo "[dev-up] Starting compiled backend with DATABASE_URL=${DATABASE_URL}"
echo "[dev-up] Logs will be written to: $LOGFILE"

# Start in background and save PID
DATABASE_URL="$DATABASE_URL" ENABLE_CRON=0 node dist/server.js 2>&1 | tee "$LOGFILE" &
PID=$!
sleep 1
if ps -p $PID >/dev/null 2>&1; then
  echo "[dev-up] Backend started (pid=$PID)."
  echo "[dev-up] To view logs: tail -f $LOGFILE"
  echo "[dev-up] To stop: kill $PID"
  echo "[dev-up] Server should be available at http://localhost:4000"
else
  echo "[dev-up] Failed to start backend — check $LOGFILE for details"
  exit 1
fi

exit 0
