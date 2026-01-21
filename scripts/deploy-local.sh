#!/bin/sh
# DEV-ONLY: Local deploy helper for demo purposes.
# Brings up Postgres (docker-compose), applies Prisma steps (with confirmation for migrate),
# installs deps, and starts backend/frontend in the background.
# SECURITY: Do NOT use with real payment or PII data. ENABLE_CRON=0 is set for safety.

set -eu

REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
LOG_DIR="$REPO_ROOT/logs"
TMP_DIR="$REPO_ROOT/tmp"
DB_PORT=${DB_PORT:-5432}
API_PORT=${API_PORT:-4000}
WEB_PORT=${WEB_PORT:-5173}

mkdir -p "$LOG_DIR" "$TMP_DIR"

# Helper: check binary presence
have_bin() { command -v "$1" >/dev/null 2>&1; }

# Determine docker compose command (docker-compose or docker compose)
DCMD=""
if have_bin docker-compose; then
  DCMD="docker-compose"
elif have_bin docker; then
  # Check if docker compose plugin is available
  docker compose version >/dev/null 2>&1 && DCMD="docker compose"
fi

# Defensive checks
MISSING=""
for b in docker npm npx; do
  have_bin "$b" || MISSING="$MISSING $b"
done
if [ -z "$DCMD" ]; then
  MISSING="$MISSING docker-compose"
fi
if [ -n "$MISSING" ]; then
  echo "Missing required tools:$MISSING" >&2
  echo "Please install Docker, docker-compose (or Docker Compose plugin), Node.js/npm." >&2
  exit 1
fi

# Bring up Postgres using compose
echo "Starting Postgres via docker-compose..."
if [ -f "$REPO_ROOT/scripts/compose-up.sh" ]; then
  # Call project-provided compose script, but continue even if it fails (we'll ensure DB below)
  (cd "$REPO_ROOT" && ./scripts/compose-up.sh) || echo "compose-up.sh failed; continuing to ensure DB service is up"
fi
# Ensure DB service is up even if compose-up.sh didn't start it
(cd "$REPO_ROOT" && $DCMD up -d db) || (cd "$REPO_ROOT" && $DCMD up -d postgres)

# Wait for Postgres to listen on DB_PORT (max 60s)
WAIT_MAX=60
WAIT_SECS=0
printf "Waiting for Postgres on port %s" "$DB_PORT"
while [ $WAIT_SECS -lt $WAIT_MAX ]; do
  if lsof -i ":$DB_PORT" >/dev/null 2>&1; then
    echo " - ready"
    break
  fi
  printf "."
  sleep 1
  WAIT_SECS=$((WAIT_SECS+1))
  if [ $WAIT_SECS -eq $WAIT_MAX ]; then
    echo "\nWarning: Postgres not detected on port $DB_PORT after $WAIT_MAXs. Continuing anyway."
  fi
done

# Backend setup (exit outer script on failure)
(
  cd "$REPO_ROOT/backend" || { echo "Error: cannot cd to backend" >&2; exit 1; }

  echo "Installing backend deps (npm ci)..."
  npm ci || { echo "npm ci failed in backend" >&2; exit 1; }

  echo "Running Prisma format & generate..."
  npx prisma format || echo "Warning: prisma format failed"
  npx prisma generate || { echo "Error: prisma generate failed" >&2; exit 1; }

  # Export DATABASE_URL from .env if present; else use compose defaults for local DB
  if [ -z "${DATABASE_URL-}" ]; then
    if [ -f .env ]; then
      DB_URL=$(grep -E '^DATABASE_URL=' .env | sed 's/^DATABASE_URL=//' | sed 's/^"//;s/"$//')
    elif [ -f "$REPO_ROOT/.env" ]; then
      DB_URL=$(grep -E '^DATABASE_URL=' "$REPO_ROOT/.env" | sed 's/^DATABASE_URL=//' | sed 's/^"//;s/"$//')
    else
      DB_URL="postgresql://mobility:mobility_pass@localhost:$DB_PORT/mobility_db"
    fi
    # If backend/.env contains the template USER/PASSWORD placeholder, ignore it.
    case "$DB_URL" in
      *postgresql://USER:PASSWORD@*|*postgres://USER:PASSWORD@*)
        DB_URL="postgresql://mobility:mobility_pass@localhost:$DB_PORT/mobility_db"
        ;;
    esac
    if [ -n "$DB_URL" ]; then
      export DATABASE_URL="$DB_URL"
      echo "Using DATABASE_URL from env or default for local DB (not printed for safety)."
    fi
  fi

  # Confirm before running prisma migrate dev
  echo "\nAbout to run Prisma migrations in DEV (npx prisma migrate dev --name init)."
  echo "This may alter your local DB schema. Proceed? [y/N]"
  read ans
  case "$ans" in
    y|Y)
      npx prisma migrate dev --name init || { echo "Error: prisma migrate dev failed" >&2; exit 1; }
      ;;
    *)
      echo "Skipped prisma migrate dev."
      ;;
  esac

  echo "Starting backend dev server..."
  ENABLE_CRON=0 npm run dev > "$LOG_DIR/backend.log" 2>&1 &
  BACKEND_PID=$!
  printf "%s\n" "$BACKEND_PID" > "$TMP_DIR/backend.pid"
  echo "Backend started (PID: $BACKEND_PID). Logs: $LOG_DIR/backend.log"
)
BACKEND_STATUS=$?
if [ "$BACKEND_STATUS" -ne 0 ]; then
  echo "Backend setup failed." >&2
  exit 1
fi

# Frontend setup (exit outer script on failure)
(
  cd "$REPO_ROOT/frontend" || { echo "Error: cannot cd to frontend" >&2; exit 1; }

  echo "Installing frontend deps (npm ci)..."
  if ! npm ci >/dev/null 2>&1; then
    echo "npm ci failed in frontend; falling back to npm install..."
    npm install || { echo "npm install failed in frontend" >&2; exit 1; }
  fi

  API_URL_DEFAULT="http://localhost:$API_PORT"
  if [ -n "${API_URL-}" ]; then
    VITE_API_URL="$API_URL"
  else
    VITE_API_URL="$API_URL_DEFAULT"
  fi

  echo "Starting frontend dev server with VITE_API_URL=$VITE_API_URL ..."
  VITE_API_URL="$VITE_API_URL" npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
  FRONTEND_PID=$!
  printf "%s\n" "$FRONTEND_PID" > "$TMP_DIR/frontend.pid"
  echo "Frontend started (PID: $FRONTEND_PID). Logs: $LOG_DIR/frontend.log"
)
FRONTEND_STATUS=$?
if [ "$FRONTEND_STATUS" -ne 0 ]; then
  echo "Frontend setup failed." >&2
  exit 1
fi

# Final output
echo "\nDEV servers running:"
echo "Frontend: http://localhost:$WEB_PORT"
echo "Backend API: http://localhost:$API_PORT"

echo "\nTo stop everything and tail logs, run: ./scripts/stop-local.sh"
echo "Security: DEV-ONLY. ENABLE_CRON=0 is set. Do not use real payment or PII data."
