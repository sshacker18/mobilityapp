// @ts-nocheck
import { test, expect } from '@playwright/test';
import { login as sel, booking as bsel } from '../lib/selectors';

test.describe.skip('Booking regression @regression (legacy booking flow)', () => {
  test('book a CAB and choose pay after ride', async ({ page }) => {
    await page.goto('/login');
    // quick login via dev OTP
    await page.fill(sel.phoneInput, '9999999999');
    await page.click(sel.requestOtpBtn);
    const otpText = await page.locator(sel.devOtpText).innerText({ timeout: 5000 });
    const otp = otpText.match(/(\d{4,6})/)[1];
    await page.fill(sel.otpInput, otp);
    await page.click(sel.submitBtn);

    await page.waitForURL('/home', { timeout: 10_000 });
    await page.click('//button[contains(., "CAB")]');
    // Use my location (this button may trigger geolocation prompt); tests assume the app falls back gracefully
    await page.click(bsel.useMyLocationBtn);
    await page.click(bsel.confirmBtn);

    // Wait for booking card to appear
    await expect(page.locator(bsel.bookingCard)).toBeVisible({ timeout: 15_000 });

    // Navigate to payment page
    await page.click('a[href="/payment"]');
    await expect(page.locator(bsel.paymentStatus)).toContainText(/Pay Later|PAY_LATER|Pay after ride/);
  });
});
