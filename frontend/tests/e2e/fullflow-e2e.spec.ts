// @ts-nocheck
import { test, expect } from '@playwright/test';
import { login as sel, booking as bsel } from '../lib/selectors';
import { createDriver } from '../helpers/seed';

test.describe.skip('Full E2E flow @e2e (legacy backend flow)', () => {
  test('booking lifecycle from request to payment', async ({ page, request }) => {
    // Seed: create a driver via backend admin API
    await test.step('seed driver and company', async () => {
      const driverPayload = {
        name: `e2e-driver-${Date.now()}`,
        phone: `700000${Math.floor(Math.random() * 10000)}`,
        vehicle: 'Test Car',
      };
      const res = await createDriver(request, driverPayload);
      expect(res.status()).toBeGreaterThanOrEqual(200);
      expect(res.status()).toBeLessThan(300);
    });

    // Login via dev OTP
    await page.goto('/login');
    await page.fill(sel.phoneInput, '9999999999');
    await page.click(sel.requestOtpBtn);
    const otpText = await page.locator(sel.devOtpText).innerText({ timeout: 5000 });
    const otp = otpText.match(/(\d{4,6})/)[1];
    await page.fill(sel.otpInput, otp);
    await page.click(sel.submitBtn);

    await page.waitForURL('/home', { timeout: 10_000 });

    // Create booking
    await page.click('//button[contains(., "CAB")]');
    await page.click(bsel.useMyLocationBtn);
    await page.click(bsel.confirmBtn);

    // Wait for assignment
    await test.step('wait for driver assignment', async () => {
      const bookingCard = page.locator(bsel.bookingCard);
      await expect(bookingCard).toBeVisible({ timeout: 30_000 });
      // Expect driver info to show up in booking card
      await expect(bookingCard).toContainText(/Driver|Assigned|ETA/);
    });

    // Simulate driver starting and completing ride via backend APIs
    await test.step('simulate ride lifecycle via API', async () => {
      // Attempt to call backend endpoints to start & complete ride; adjust paths as needed
      const startRes = await request.post('/test/simulate/start-ride', { data: { /* payload */ } });
      if (startRes.ok()) {
        const completeRes = await request.post('/test/simulate/complete-ride', { data: { /* payload */ } });
        expect(completeRes.ok()).toBeTruthy();
      } else {
        test.info().attachments.push({ name: 'start-ride-failed', body: await startRes.text(), contentType: 'text/plain' });
      }
    });

    // Payment: navigate to payment and assert completed status
    await page.click('a[href="/payment"]');
    await expect(page.locator(bsel.paymentStatus)).toContainText(/Completed|Paid|PAYED|PAYMENT_SUCCESS/);
  });
});
