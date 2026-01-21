import { test, expect } from '@playwright/test'
import { loginWithOtp, mockAuthRoutes, startBooking } from '../helpers/wizard'

test.describe('Regression destination recents @regression', () => {
  test('Hyderabad hotspots are selectable', async ({ page }) => {
    await mockAuthRoutes(page)
    await loginWithOtp(page)
    await startBooking(page, 'BIKE')

    await page.locator('.PhoneInputInput').fill('+919876543210')
    await page.getByRole('button', { name: 'Send OTP' }).click()
    const otpInputs = page.locator('input[aria-label^="OTP digit"]')
    for (let i = 0; i < 4; i += 1) {
      await otpInputs.nth(i).fill(String(i + 1))
    }

    await page.getByTestId('pickup-address').fill('Balapur X Road, Hyderabad')
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page.getByText('Choose your destination')).toBeVisible()
    await page.getByRole('button', { name: 'Hitech City' }).click()
    await expect(page.locator('.select__single-value')).toHaveText('Hitech City')
  })
})
