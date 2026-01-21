Mobility Backend

This folder contains the backend scaffold for the India-first mobility super app.

Next steps:
1. Copy `.env.example` to `.env` and fill DATABASE_URL and JWT_SECRET.
2. Run `npm install` in this folder to install dependencies.
3. Run `npx prisma migrate dev --name init` to apply Prisma schema (requires a running Postgres).
4. Implement routes: auth, drivers, bookings, wallet, admin.

We will implement these step-by-step. After you confirm, I'll implement the auth skeleton next.
