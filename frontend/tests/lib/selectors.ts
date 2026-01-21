export const login = {
  phoneInput: 'input[name="phone"]',
  requestOtpBtn: 'button[data-testid="request-otp"]',
  devOtpText: '[data-testid="dev-otp"]',
  otpInput: 'input[name="otp"]',
  submitBtn: 'button[type="submit"]',
};

export const home = {
  modeTile: (modeName: string) => `//button[contains(., '${modeName}')]`,
  bookingCard: '[data-testid="booking-card"]',
};

export const booking = {
  useMyLocationBtn: 'button[data-testid="use-my-location"]',
  confirmBtn: 'button[data-testid="confirm-booking"]',
  paymentStatus: '[data-testid="payment-status"]',
};
