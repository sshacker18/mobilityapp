Playwright E2E (smoke/regression/e2e)
====================================

Quick start
-----------

1. Install dependencies and Playwright browsers:

   npm install
   npm run playwright:install

2. Start servers (either manually or let Playwright start them):

   # Start backend manually (optional)
   cd ../backend && npm run dev

   # Start frontend manually (optional)
   cd frontend && npm run dev

Or let Playwright start both servers automatically by setting PW_LOCAL_SERVERS=1 when running tests; global-setup will attempt to start backend and frontend dev servers.

Running tests
-------------

- Run all Playwright tests:

  npm run test:playwright

- Run smoke suite only:

  npm run test:smoke

- Run regression suite only:

  npm run test:regression

- Run e2e suite only:

  npm run test:e2e

Headed mode (debug):

  npm run test:playwright:headed

AI-assisted test generation
--------------------------

If your Playwright version supports codegen/AI helpers, run:

  npm run test:ai-generate

This opens an interactive browser window and records your actions into a test skeleton. After recording, paste the generated test into `tests/` and adapt selectors and assertions as needed.

Notes & adaptation points
------------------------

- The fixtures in `tests/fixtures` will attempt to start the backend at `http://localhost:4000` and frontend at `http://localhost:5173`. Override by setting `TEST_BACKEND_URL` and `TEST_FRONTEND_URL`.
- If your backend admin or test endpoints differ, update `tests/helpers/seed.ts` and `tests/e2e/fullflow-e2e.spec.ts` to call the correct API routes.
- The tests use a dev-only OTP display element (`[data-testid="dev-otp"]`). If your app does not expose OTP in dev, modify the login helper to use a test-account credential or seed the session via API.
