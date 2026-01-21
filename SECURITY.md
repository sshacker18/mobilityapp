# Security & Privacy Notes

This project includes templates and scripts to help deploy the app. Follow these security best practices before making the app public.

- Do NOT commit secrets or .env files to the repository.
- Use GitHub Secrets (Repository Settings -> Secrets) for CI and hosting env variables.
- Rotate `JWT_SECRET` before production use and store it in your hosting provider's secret store.
- Use HTTPS in production and enforce secure cookies where applicable.
- Limit access to admin endpoints and review any test-only endpoints.
- For payments, integrate a PCI-compliant provider before handling real transactions. Current tests use dummy UPI/payment flows only.
