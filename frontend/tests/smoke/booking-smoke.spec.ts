import { test, expect } from '@playwright/test'
import { loginWithOtp, mockAuthRoutes, startBooking } from '../helpers/wizard'

test.describe('Smoke booking flow @smoke', () => {
  test('login + auto booking entry', async ({ page }) => {
    await mockAuthRoutes(page)
    await loginWithOtp(page)

    await startBooking(page, 'AUTO')
    await expect(page.getByText('Let’s get you moving')).toBeVisible()
  })
})
