#!/bin/sh
# Dev-only script to stop backend/frontend servers and any tunnels started by share-with-ngrok.sh.
# Reads PID files from ./tmp/*.pid and kills processes after confirmation.
# Shows recent logs for inspection.

REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
LOG_DIR="$REPO_ROOT/logs"
TMP_DIR="$REPO_ROOT/tmp"

if [ ! -d "$TMP_DIR" ]; then
  echo "Nothing to stop: tmp/ directory does not exist."
  exit 0
fi

# Gather PID files
PID_FILES=$(ls "$TMP_DIR"/*.pid 2>/dev/null)
if [ -z "$PID_FILES" ]; then
  echo "No PID files found in tmp/. Nothing to stop."
else
  for f in $PID_FILES; do
    echo "Processing PID file: $f"
    for pid in $(cat "$f"); do
      if [ -n "$pid" ]; then
        CMD=$(ps -p "$pid" -o pid=,comm=,command= 2>/dev/null)
        if [ -n "$CMD" ]; then
          echo "Found PID $pid: $CMD"
        else
          echo "PID $pid appears to be gone."
        fi
        printf "Kill this process? [y/N]: "
        read ans
        case "$ans" in
          y|Y)
            kill "$pid" 2>/dev/null || echo "Could not kill PID $pid (it may have already exited)."
            ;;
          *)
            echo "Skipped PID $pid"
            ;;
        esac
      fi
    done
    rm -f "$f"
  done
fi

# Show recent logs for convenience
if [ -d "$LOG_DIR" ]; then
  echo "\nRecent backend logs (last 50 lines):"
  if [ -f "$LOG_DIR/backend.log" ]; then
    tail -n 50 "$LOG_DIR/backend.log"
  else
    echo "No backend.log found."
  fi
  echo "\nRecent frontend logs (last 50 lines):"
  if [ -f "$LOG_DIR/frontend.log" ]; then
    tail -n 50 "$LOG_DIR/frontend.log"
  else
    echo "No frontend.log found."
  fi
fi

echo "\nCleanup complete. If you need to re-run, start servers with: \n  ./scripts/start-servers.sh\nAnd share with: \n  ./scripts/share-with-ngrok.sh"
