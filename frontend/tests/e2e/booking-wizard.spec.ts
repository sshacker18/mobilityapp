import { test } from '@playwright/test';
import { completeWizard, loginWithOtp, mockAuthRoutes, startBooking } from '../helpers/wizard';

const modes = ['AUTO', 'CAR', 'BIKE', 'SCOOTY', 'EV'];

test.describe('Booking wizard flow @e2e', () => {
  modes.forEach((mode) => {
    test(`${mode.toLowerCase()} booking`, async ({ page }) => {
      await mockAuthRoutes(page);
      await loginWithOtp(page);
      await startBooking(page, mode);
      await completeWizard(page);
    });
  });
});
