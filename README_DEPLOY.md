# Deployment guide

This document explains how to push this repository to GitHub and deploy the frontend and backend using free or low-cost hosting options such as Vercel (frontend) and Railway (backend). It also includes a local option using Docker Compose and ngrok for demos.

Prerequisites
-------------

- Node.js 20+, npm
- Docker & docker-compose (for local option)
- Git and GitHub account
- gh CLI (optional, used by create_repo_and_push.sh)

Step 1 — Create repository and push
----------------------------------

Run the helper script to create the GitHub repo and push:

  chmod +x ./create_repo_and_push.sh && ./create_repo_and_push.sh

Follow the prompts for owner and repo name.

Secrets to configure in GitHub (Repository -> Settings -> Secrets):

- DATABASE_URL (Postgres connection string)
- JWT_SECRET
- RAILWAY_TOKEN (if using Railway)
- VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID (if using Vercel)
- DOCKERHUB_USERNAME, DOCKERHUB_TOKEN (if using Docker image pushes)

Option A — Vercel (frontend) + Railway (backend)
------------------------------------------------

Frontend (Vercel):

1. In Vercel, import the GitHub repo.
2. Set environment variable VITE_API_URL to your backend URL (https://<your-backend>.railway.app).
3. Deploy. Vercel will build the frontend and serve the static site.

Backend (Railway):

1. Create a Railway project and add a Postgres plugin.
2. Set DATABASE_URL and JWT_SECRET in Railway environment variables.
3. Deploy the backend via Railway's GitHub integration or the Railway CLI.
4. Run migrations after DB is provisioned:

   npx prisma migrate deploy

Notes:
- Railway provides a simple Postgres add-on; connect your repo via the UI for auto-deploys.
- Use the Railway dashboard to find the DATABASE_URL to set in Vercel (if necessary).

Option B — Local + ngrok for sharing demos
------------------------------------------

1. Start services: (from repo root)

   ./scripts/compose-up.sh

2. Run migrations inside backend container:

   docker-compose exec backend npx prisma migrate deploy

3. Expose local ports using ngrok (or localtunnel):

   ngrok http 5173
   ngrok http 4000

Security note: ngrok URLs are public and temporary. Use them only for demos.

Importing data (Excel/CSV)
--------------------------

There is a skeleton script at `scripts/import-excel.ts` which expects CSV input. Workflow:

1. Export your Excel sheet to CSV.
2. Edit `scripts/import-excel.ts` to map CSV columns to Prisma models.
3. Run:

   npx ts-node scripts/import-excel.ts path/to/file.csv

The script will prompt for confirmation before writing to the database.

Migrations
----------

Always run `npx prisma migrate deploy` after provisioning or restoring a database. In development you can use `npx prisma migrate dev`.
