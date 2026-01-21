import type { APIRequestContext } from '@playwright/test';

/**
 * Seed helpers that use Playwright's request API to create deterministic state.
 * Update endpoints based on your backend routes.
 */
export async function createAdminIfNeeded(request: APIRequestContext, adminPayload: any) {
  // Example: POST /admin/setup or POST /admin/users
  // Adjust the path to match your backend admin/seed API
  try {
    const res = await request.post('/admin/setup', { data: adminPayload });
    return res.ok();
  } catch (e) {
    return false;
  }
}

export async function createDriver(request: APIRequestContext, driverPayload: any) {
  // Example endpoint: POST /admin/drivers
  const res = await request.post('/admin/drivers', { data: driverPayload });
  return res;
}
