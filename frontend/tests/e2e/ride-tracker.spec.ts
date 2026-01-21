import { test, expect } from '@playwright/test'
import { completeWizard, loginWithOtp, mockAuthRoutes, selectDriverAndGoToTracker, startBooking } from '../helpers/wizard'

test.describe('Ride tracker flow @e2e', () => {
  test('start ride and live progress', async ({ page }) => {
    await mockAuthRoutes(page)
    await loginWithOtp(page)
    await startBooking(page, 'CAR')
    await completeWizard(page)
    await selectDriverAndGoToTracker(page)

    await expect(page.getByText('Live ride tracker')).toBeVisible()
    await page.getByRole('button', { name: 'Start ride' }).click()
    await expect(page.getByText('Ride started')).toBeVisible()
  })
})

// Mobile viewport check using Chrome emulation
// Run with: PW_HEADED=1 PLAYWRIGHT_BASE_URL=http://localhost:5174 npx playwright test tests/e2e/ride-tracker.spec.ts --project=chromium
