#!/bin/sh
# DEV-ONLY: Environment preflight for local demo.
# Checks for required tools and free ports.
# SECURITY: Do NOT use with sensitive data.

set -u

REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
API_PORT=${API_PORT:-4000}
WEB_PORT=${WEB_PORT:-5173}

have_bin() { command -v "$1" >/dev/null 2>&1; }

# Check tools
MISSING=""
for b in docker node npm npx; do
  have_bin "$b" || MISSING="$MISSING $b"
done
# docker-compose or docker compose
if have_bin docker-compose; then
  :
elif have_bin docker; then
  docker compose version >/dev/null 2>&1 || MISSING="$MISSING docker-compose"
else
  MISSING="$MISSING docker-compose"
fi

if [ -n "$MISSING" ]; then
  echo "Missing tools:$MISSING" >&2
  echo "Install Docker, docker-compose (or Docker Compose plugin), Node.js/npm." >&2
  exit 1
fi

# Check ports
PORT_ISSUES=0
for p in "$API_PORT" "$WEB_PORT"; do
  if lsof -i ":$p" >/dev/null 2>&1; then
    echo "Port $p appears to be in use. Details:"
    lsof -i ":$p" | sed -n '1,5p'
    PORT_ISSUES=$((PORT_ISSUES+1))
  else
    echo "Port $p is free."
  fi
done

# Summary
echo "\nChecklist:"
echo "- Docker running: ensure Docker Desktop is started"
echo "- Postgres: will be started by deploy-local.sh via docker-compose"
echo "- Prisma: migrations will prompt you for confirmation"

if [ "$PORT_ISSUES" -gt 0 ]; then
  echo "\nWarning: Some required ports are in use ($PORT_ISSUES). Free them before continuing."
  exit 2
fi

echo "\nEnvironment looks good. Next: run ./scripts/deploy-local.sh"
