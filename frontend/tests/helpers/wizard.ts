import { expect, Page } from '@playwright/test'

const mockUser = { id: 'pw-user', phone: '+919876543210', role: 'USER' }

export async function mockAuthRoutes(page: Page) {
  await page.route('**/auth/request-otp', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ otp: '1234' })
    })
  })

  await page.route('**/auth/verify-otp', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'pw-test-token', user: mockUser })
    })
  })

  await page.route('**/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: mockUser })
    })
  })

  await page.route('**/api/submit', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })
}

export async function loginWithOtp(page: Page, phone = '9876543210') {
  await page.goto('/login')
  await page.getByTestId('name-input').fill('Arjun Reddy')
  await page.getByTestId('continue-name').click()
  await page.getByTestId('phone-input').fill(phone)
  await page.getByTestId('request-otp').click()
  await page.getByTestId('otp-input').fill('1234')
  await page.getByTestId('submit-otp').click()
  await page.waitForURL('**/home')
}

export async function startBooking(page: Page, mode: string) {
  await page.getByTestId(`mode-${mode}`).click()
  await page.waitForURL('**/booking/**')
  await expect(page.getByTestId('booking-mode')).toHaveText(mode)
}

export async function completeWizard(page: Page) {
  await page.getByTestId('booking-phone').fill('9876543210')
  const continueButton = page.getByRole('button', { name: 'Continue to pickup' })
  await continueButton.waitFor({ state: 'visible' })
  await continueButton.click()

  await expect(page.getByText('Find your pickup')).toBeVisible()
  await page.getByTestId('pickup-address').fill('Hitech City, Hyderabad')
  await page.getByTestId('pickup-address').press('Enter')
  const nextButton = page.getByRole('button', { name: 'Next' })
  await expect(nextButton).toBeEnabled()
  await nextButton.click()

  await expect(page.getByText('Choose your destination')).toBeVisible()
  await page.getByRole('button', { name: 'Hitech City' }).click()
  const destinationNext = page.getByRole('button', { name: 'Next' })
  await expect(destinationNext).toBeEnabled()
  await destinationNext.click()

  await expect(page.getByText('Review & submit')).toBeVisible()
  await page.getByRole('button', { name: 'Confirm booking' }).click()
  await page.waitForURL('**/order-details')
}

export async function selectDriverAndGoToTracker(page: Page) {
  await page.getByTestId('driver-drv-car-01').click()
  await page.getByRole('button', { name: /Confirm/ }).click()
  await page.waitForURL('**/ride-tracker')
}
