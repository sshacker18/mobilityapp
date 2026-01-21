import { test, expect } from '@playwright/test'
import { loginWithOtp, mockAuthRoutes, startBooking } from '../helpers/wizard'

test.describe('Regression pickup location @regression', () => {
  test('manual Hyderabad pickup enables Next', async ({ page }) => {
    await mockAuthRoutes(page)
    await loginWithOtp(page)
    await startBooking(page, 'CAR')

    await page.locator('.PhoneInputInput').fill('+919876543210')
    await page.getByRole('button', { name: 'Send OTP' }).click()

    const otpInputs = page.locator('input[aria-label^="OTP digit"]')
    for (let i = 0; i < 4; i += 1) {
      await otpInputs.nth(i).fill(String(i + 1))
    }

    await expect(page.getByText('Find your pickup')).toBeVisible()
    await page.getByTestId('pickup-address').fill('Madhapur, Hyderabad')
    const nextButton = page.getByRole('button', { name: 'Next' })
    await expect(nextButton).toBeEnabled()
  })
})
