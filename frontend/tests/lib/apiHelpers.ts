/**
 * Small helpers for working with JWTs and API requests in Playwright tests.
 * These are intentionally lightweight — adapt to your auth shapes.
 */
export function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Create a Playwright request context with auth header.
 * Example: const req = await newRequestContext({ baseURL: backendUrl, extraHTTPHeaders: authHeader(token) })
 */
