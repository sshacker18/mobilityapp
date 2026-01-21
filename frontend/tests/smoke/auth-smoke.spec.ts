// @ts-nocheck
import { test, expect } from '@playwright/test';
import { login as sel } from '../lib/selectors';

test.describe.skip('Auth smoke @smoke (legacy OTP flow)', () => {
  test('request OTP and login flow', async ({ page, baseURL }) => {
    await test.step('go to login page', async () => {
      await page.goto('/login');
      await expect(page).toHaveURL(/\/login/);
    });

    await test.step('request OTP for test phone', async () => {
      await page.fill(sel.phoneInput, '9999999999');
      await page.click(sel.requestOtpBtn);
      // Dev UI exposes OTP in a test-only element
      const otpText = await page.locator(sel.devOtpText).innerText({ timeout: 5000 });
      expect(otpText).toMatch(/\d{4,6}/);
      const otp = otpText.match(/(\d{4,6})/)[1];

      await page.fill(sel.otpInput, otp);
      await page.click(sel.submitBtn);
    });

    await test.step('redirect to home and see mode tiles', async () => {
      await page.waitForURL('/home', { timeout: 10_000 });
      await expect(page.locator('text=Ride')).toBeVisible();
    });
  });
});
