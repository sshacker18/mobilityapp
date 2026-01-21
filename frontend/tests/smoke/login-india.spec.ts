import { test, expect } from '@playwright/test'
import { loginWithOtp, mockAuthRoutes } from '../helpers/wizard'

test.describe('Smoke login @smoke', () => {
  test('India phone OTP login', async ({ page }) => {
    await mockAuthRoutes(page)
    await loginWithOtp(page, '9900099000')
    await expect(page.getByText('Choose your ride')).toBeVisible()
  })
})
