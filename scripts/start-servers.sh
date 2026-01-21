#!/bin/sh
# Dev-only script to start backend and frontend locally in the background.
# It writes logs to ./logs/ and saves PIDs to ./tmp/ for easy cleanup.
# This is for demos only. Do NOT use this in production.

# Resolve repo root relative to this script
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
LOG_DIR="$REPO_ROOT/logs"
TMP_DIR="$REPO_ROOT/tmp"

# Ensure logs/ and tmp/ directories exist
mkdir -p "$LOG_DIR" "$TMP_DIR"

# Optional: if compose-up.sh exists, suggest starting backing services (e.g., DB)
if [ -f "$REPO_ROOT/scripts/compose-up.sh" ]; then
  echo "Optional: start backing services (database, etc.) by running: \n  ./scripts/compose-up.sh"
fi

# Defensive check for npm
if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed or not in PATH. Please install Node.js/npm before continuing." >&2
  exit 1
fi

# Start backend dev server in background
(
  cd "$REPO_ROOT/backend" || {
    echo "Error: cannot cd to backend/." >&2
    exit 1
  }

  # Export DATABASE_URL if provided in a .env (do not print secrets)
  if [ -f .env ]; then
    DB_URL=$(grep -E '^DATABASE_URL=' .env | sed 's/^DATABASE_URL=//')
    if [ -n "$DB_URL" ]; then
      export DATABASE_URL="$DB_URL"
    fi
  elif [ -f "$REPO_ROOT/.env" ]; then
    DB_URL=$(grep -E '^DATABASE_URL=' "$REPO_ROOT/.env" | sed 's/^DATABASE_URL=//')
    if [ -n "$DB_URL" ]; then
      export DATABASE_URL="$DB_URL"
    fi
  fi

  echo "Starting backend (npm run dev) with ENABLE_CRON=0 ..."
  ENABLE_CRON=0 npm run dev > "$LOG_DIR/backend.log" 2>&1 &
  BACKEND_PID=$!
  printf "%s\n" "$BACKEND_PID" > "$TMP_DIR/backend.pid"
  echo "Backend started (PID: $BACKEND_PID). Logs: logs/backend.log"
)

# Start frontend dev server in background
(
  cd "$REPO_ROOT/frontend" || {
    echo "Error: cannot cd to frontend/." >&2
    exit 1
  }

  # Use API_URL env if provided, default to http://localhost:4000
  API_URL_DEFAULT="http://localhost:4000"
  if [ -n "$API_URL" ]; then
    VITE_API_URL="$API_URL"
  else
    VITE_API_URL="$API_URL_DEFAULT"
  fi

  echo "Starting frontend (npm run dev) with VITE_API_URL=$VITE_API_URL ..."
  VITE_API_URL="$VITE_API_URL" npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
  FRONTEND_PID=$!
  printf "%s\n" "$FRONTEND_PID" > "$TMP_DIR/frontend.pid"
  echo "Frontend started (PID: $FRONTEND_PID). Logs: logs/frontend.log"
)

echo "\nServers started in background. To stop them later, run: \n  ./scripts/stop-servers.sh"
