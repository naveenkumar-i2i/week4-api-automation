import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
import { AuthAPI } from '../pom/auth.api';

dotenv.config();

test.describe('Task 3: Security Assessment of Login', () => {
  let apiContext;
  let auth: AuthAPI;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    auth = new AuthAPI(apiContext);
  });

  test('SQL Injection attempt in login should be rejected', async () => {
    const resp = await auth.login("admin' OR '1'='1", 'dummy');
    expect(resp.status()).toBeGreaterThanOrEqual(400);
    expect(resp.status()).toBeLessThan(500);
  });

  test('Access protected endpoint without token should return 401', async () => {
    const resp = await apiContext.get(`${process.env.BASE_URL}/auth/me`);
    expect(resp.status()).toBe(401);
  });

  test('Access protected endpoint with invalid token should return 401 or server error', async () => {
    const resp = await auth.getProfile('invalid.token.here');
    // DummyJSON returns 500 for invalid token; allow both 401 and 500
    expect([401, 500]).toContain(resp.status());
  });

  test('Role‑based access control (placeholder)', async () => {
    test.skip(true, 'Skip until real role‑based endpoint is available');
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
