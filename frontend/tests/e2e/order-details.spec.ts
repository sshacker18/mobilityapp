import { test, expect } from '@playwright/test'
import { completeWizard, loginWithOtp, mockAuthRoutes, startBooking } from '../helpers/wizard'

test.describe('Order details driver selection @e2e', () => {
  test('select driver by rating filters', async ({ page }) => {
    await mockAuthRoutes(page)
    await loginWithOtp(page)
    await startBooking(page, 'CAR')
    await completeWizard(page)

    await expect(page.getByText('Pick your driver')).toBeVisible()
    await page.getByText('Max distance').click()
    await page.getByRole('slider').first().fill('4')
    await page.getByRole('slider').nth(1).fill('4.6')

    const driverCard = page.getByTestId('driver-drv-car-01')
    await driverCard.click()

    await expect(page.getByRole('button', { name: /Confirm/ })).toBeEnabled()
  })
})
