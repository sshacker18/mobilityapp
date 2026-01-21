#!/bin/sh
# DEV-ONLY: Stop local backend/frontend dev servers and (optionally) docker-compose services.
# SECURITY: Do NOT use with sensitive data.

set -u

REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
LOG_DIR="$REPO_ROOT/logs"
TMP_DIR="$REPO_ROOT/tmp"

# Stop processes from PID files
if ls "$TMP_DIR"/*.pid >/dev/null 2>&1; then
	for f in "$TMP_DIR"/*.pid; do
		echo "Processing PID file: $f"
		for pid in $(cat "$f"); do
			if [ -n "$pid" ]; then
				CMD=$(ps -p "$pid" -o pid=,comm=,command= 2>/dev/null)
				if [ -n "$CMD" ]; then
					echo "Stopping PID $pid: $CMD"
					kill "$pid" 2>/dev/null || echo "Warning: kill failed (maybe already exited)"
					# Wait up to ~5s for exit
					i=0
					while [ $i -lt 5 ]; do
						ps -p "$pid" >/dev/null 2>&1 || break
						sleep 1
						i=$((i+1))
					done
					ps -p "$pid" >/dev/null 2>&1 && echo "PID $pid still running; you may need to kill -9 $pid"
				else
					echo "PID $pid not found; skipping."
				fi
			fi
		done
		rm -f "$f"
	done
else
	echo "No PID files in tmp/."
fi

# Prompt to bring down docker-compose services
printf "Bring down docker-compose services? [y/N]: "
read ans
case "$ans" in
	y|Y)
		if [ -f "$REPO_ROOT/scripts/compose-down.sh" ]; then
			(cd "$REPO_ROOT" && ./scripts/compose-down.sh)
		else
			if command -v docker-compose >/dev/null 2>&1; then
				(cd "$REPO_ROOT" && docker-compose down)
			elif command -v docker >/dev/null 2>&1; then
				docker compose version >/dev/null 2>&1 && (cd "$REPO_ROOT" && docker compose down)
			else
				echo "docker-compose not available; skip."
			fi
		fi
		;;
	*)
		echo "Leaving containers running."
		;;
esac

# Tail logs for debugging
if [ -d "$LOG_DIR" ]; then
	echo "\nLast 200 lines of backend log:"
	[ -f "$LOG_DIR/backend.log" ] && tail -n 200 "$LOG_DIR/backend.log" || echo "No backend.log"
	echo "\nLast 200 lines of frontend log:"
	[ -f "$LOG_DIR/frontend.log" ] && tail -n 200 "$LOG_DIR/frontend.log" || echo "No frontend.log"
	echo "\nLogs are in: $LOG_DIR"
else
	echo "No logs directory found."
fi

echo "\nCleanup complete. You can re-run with: ./scripts/deploy-local.sh"
