# Dev-only Share Workflow

This repo includes a safe, dev-only workflow to run the local backend and frontend, and expose them to the internet for demo purposes using ngrok or localtunnel.

## Prerequisites
- Docker (optional)
- Node.js and npm
- ngrok (recommended) or `npx localtunnel` (fallback)

## How to start servers
Make scripts executable and start servers:

```sh
chmod +x ./scripts/start-servers.sh && ./scripts/start-servers.sh
```

- Backend logs: `logs/backend.log`
- Frontend logs: `logs/frontend.log`
- PIDs are saved in `tmp/`
- If `./scripts/compose-up.sh` exists, you may run it manually to start backing services (e.g., DB).

## How to share publicly
Expose local servers with tunnels (ngrok or localtunnel):

```sh
chmod +x ./scripts/share-with-ngrok.sh && ./scripts/share-with-ngrok.sh
```

- If `NGROK_AUTHTOKEN` is set, ngrok will use it automatically. Otherwise, tunnels may be ephemeral.
- The script prints public URLs. Set `VITE_API_URL` to the backend tunnel URL before visiting the frontend URL.
- Tunnel PIDs are saved in `tmp/` for cleanup.

## How to stop and cleanup
Stop servers and tunnels, and view recent logs:

```sh
chmod +x ./scripts/stop-servers.sh && ./scripts/stop-servers.sh
```

## One-line quick run
Start servers and share with a single command:

```sh
chmod +x ./scripts/start-servers.sh ./scripts/share-with-ngrok.sh && ./scripts/start-servers.sh && ./scripts/share-with-ngrok.sh
```

## Security note
These tunnels are public and temporary. Do not use for production or with sensitive data. Rotate any secrets if they were exposed. If using Vercel/Railway for production, prefer those over tunnels for public sharing.
