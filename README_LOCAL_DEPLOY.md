# DEV-ONLY Local Deploy

This adds a safe, developer-only workflow to run Postgres, apply Prisma steps (with confirmation), and start the backend and frontend locally for a demo.

## Prerequisites
- Docker (with docker-compose or Docker Compose plugin)
- Node.js v18+
- npm

## One-line quick run
```sh
chmod +x ./scripts/deploy-local.sh ./scripts/stop-local.sh ./scripts/check-setup.sh && ./scripts/check-setup.sh && ./scripts/deploy-local.sh
```

## How to stop
```sh
./scripts/stop-local.sh
```

## Security warnings
- DEV-ONLY. Do not use real payment data or PII.
- Backend starts with `ENABLE_CRON=0` by default.

## How to share temporarily
If you have `scripts/share-with-ngrok.sh`, you can expose your local app over the internet:
```sh
chmod +x ./scripts/share-with-ngrok.sh && ./scripts/share-with-ngrok.sh
```

## Notes
- Postgres is brought up via `docker-compose`. If `./scripts/compose-up.sh` exists, it will be used (frontend container build errors can be ignored for local Vite dev). The script ensures the `db`/`postgres` service is started.
- Prisma migrations prompt for confirmation before running `npx prisma migrate dev`.
- DATABASE_URL: The script will use `backend/.env` or repo `.env` if set; otherwise it defaults to `postgresql://mobility:mobility_pass@localhost:5432/mobility_db` to match the compose `db` service.
- Logs are written to `logs/`; PIDs are saved in `tmp/` for cleanup.
