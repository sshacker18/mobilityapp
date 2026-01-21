import { test, expect } from '@playwright/test'
import { loginWithOtp, mockAuthRoutes, startBooking } from '../helpers/wizard'

test.describe('Regression review summary @regression', () => {
  test('review shows mode and Hyderabad pickup', async ({ page }) => {
    await mockAuthRoutes(page)
    await loginWithOtp(page)
    await startBooking(page, 'EV')

    await page.locator('.PhoneInputInput').fill('+919876543210')
    await page.getByRole('button', { name: 'Send OTP' }).click()
    const otpInputs = page.locator('input[aria-label^="OTP digit"]')
    for (let i = 0; i < 4; i += 1) {
      await otpInputs.nth(i).fill(String(i + 1))
    }

    await page.getByTestId('pickup-address').fill('Gachibowli, Hyderabad')
    await page.getByRole('button', { name: 'Next' }).click()

    await page.getByRole('button', { name: 'Hitech City' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page.getByText('Review & submit')).toBeVisible()
    await expect(page.getByText('Mode:')).toBeVisible()
    await expect(page.getByText('Gachibowli, Hyderabad')).toBeVisible()
  })
})
