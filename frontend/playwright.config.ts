import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    headless: process.env.PW_HEADED === '1' ? false : undefined,
    launchOptions: process.env.PW_SLOWMO
      ? { slowMo: Number(process.env.PW_SLOWMO) }
      : undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iphone',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'pixel',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'samsung',
      use: {
        ...devices['Galaxy S9+'],
        viewport: { width: 412, height: 915 },
      },
    },
  ],
  globalSetup: path.join(__dirname, 'tests', 'fixtures', 'global-setup'),
});

/*
Notes:
- globalSetup will optionally start frontend and backend servers when environment variable
  PW_LOCAL_SERVERS=1 is set. See ./tests/fixtures/global-setup.ts
- baseURL can be overridden with PLAYWRIGHT_BASE_URL env var.
*/
