#!/bin/sh
# Dev-only script to expose local backend and frontend via ngrok or localtunnel.
# Prints temporary public URLs for demo purposes and saves tunnel PIDs to ./tmp/.
# This is for demos only. Do NOT use this in production.

REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
LOG_DIR="$REPO_ROOT/logs"
TMP_DIR="$REPO_ROOT/tmp"
mkdir -p "$LOG_DIR" "$TMP_DIR"

BACKEND_PORT=${BACKEND_PORT:-4000}
FRONTEND_PORT=${FRONTEND_PORT:-5173}

echo "Preparing to share your app publicly (dev-only). Backend port: $BACKEND_PORT, Frontend port: $FRONTEND_PORT"

if command -v ngrok >/dev/null 2>&1; then
  echo "ngrok detected."
  if [ -n "$NGROK_AUTHTOKEN" ]; then
    echo "NGROK_AUTHTOKEN is set; ngrok will use it automatically if needed."
  else
    echo "Note: Without NGROK_AUTHTOKEN, tunnels may be ephemeral. Login to ngrok for persistent tunnels if desired."
  fi

  echo "Starting ngrok tunnel for backend (port $BACKEND_PORT)..."
  ngrok http "$BACKEND_PORT" --log=stdout --log-format=logfmt > "$LOG_DIR/ngrok-backend.log" 2>&1 &
  NGROK_BACK_PID=$!

  # Try to obtain the public URL
  BACK_URL=""
  i=0
  while [ $i -lt 30 ]; do
    if curl -s http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1; then
      BACK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | sed -n 's/.*"public_url":"\(https:[^"]*\)".*/\1/p' | head -n 1)
    fi
    if [ -n "$BACK_URL" ]; then break; fi
    BACK_URL=$(sed -n 's/.*url=https:\/\//https:\/\//p' "$LOG_DIR/ngrok-backend.log" | head -n 1)
    if [ -n "$BACK_URL" ]; then break; fi
    sleep 1
    i=$((i+1))
  done
  echo "Backend public URL: ${BACK_URL:-<resolving...>}"

  echo "Starting ngrok tunnel for frontend (port $FRONTEND_PORT)..."
  ngrok http "$FRONTEND_PORT" --log=stdout --log-format=logfmt > "$LOG_DIR/ngrok-frontend.log" 2>&1 &
  NGROK_FRONT_PID=$!

  FRONT_URL=""
  i=0
  while [ $i -lt 30 ]; do
    if curl -s http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1; then
      FRONT_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | sed -n 's/.*"public_url":"\(https:[^"]*\)".*/\1/p' | tail -n 1)
    fi
    if [ -n "$FRONT_URL" ]; then break; fi
    FRONT_URL=$(sed -n 's/.*url=https:\/\//https:\/\//p' "$LOG_DIR/ngrok-frontend.log" | head -n 1)
    if [ -n "$FRONT_URL" ]; then break; fi
    sleep 1
    i=$((i+1))
  done
  echo "Frontend public URL: ${FRONT_URL:-<resolving...>}"

  printf "%s\n" "$NGROK_BACK_PID" > "$TMP_DIR/ngrok.pid"
  printf "%s\n" "$NGROK_FRONT_PID" >> "$TMP_DIR/ngrok.pid"

  echo "\nImportant: Set VITE_API_URL to the backend tunnel URL before visiting the frontend URL.\nExample: VITE_API_URL=$BACK_URL"
  echo "Open the frontend URL above in your browser; it will proxy API calls when VITE_API_URL is set in the browser env or build."
else
  echo "ngrok not found. Falling back to localtunnel via npx."
  if ! command -v npx >/dev/null 2>&1; then
    echo "Error: Neither ngrok nor npx is available. Install ngrok or Node.js (for localtunnel)." >&2
    exit 1
  fi

  echo "Starting localtunnel for backend (port $BACKEND_PORT)..."
  npx localtunnel --port "$BACKEND_PORT" > "$LOG_DIR/localtunnel-backend.log" 2>&1 &
  LT_BACK_PID=$!
  BACK_URL=""
  i=0
  while [ $i -lt 30 ]; do
    BACK_URL=$(sed -n 's/.*https:\/\//https:\/\//p' "$LOG_DIR/localtunnel-backend.log" | head -n 1)
    if [ -n "$BACK_URL" ]; then break; fi
    sleep 1
    i=$((i+1))
  done
  echo "Backend public URL: ${BACK_URL:-<resolving...>}"

  echo "Starting localtunnel for frontend (port $FRONTEND_PORT)..."
  npx localtunnel --port "$FRONTEND_PORT" > "$LOG_DIR/localtunnel-frontend.log" 2>&1 &
  LT_FRONT_PID=$!
  FRONT_URL=""
  i=0
  while [ $i -lt 30 ]; do
    FRONT_URL=$(sed -n 's/.*https:\/\//https:\/\//p' "$LOG_DIR/localtunnel-frontend.log" | head -n 1)
    if [ -n "$FRONT_URL" ]; then break; fi
    sleep 1
    i=$((i+1))
  done
  echo "Frontend public URL: ${FRONT_URL:-<resolving...>}"

  printf "%s\n" "$LT_BACK_PID" > "$TMP_DIR/lt.pid"
  printf "%s\n" "$LT_FRONT_PID" >> "$TMP_DIR/lt.pid"

  echo "\nImportant: Set VITE_API_URL to the backend tunnel URL before visiting the frontend URL.\nExample: VITE_API_URL=$BACK_URL"
fi

echo "\nTunnels started. To stop and clean up later, run: \n  ./scripts/stop-servers.sh"
