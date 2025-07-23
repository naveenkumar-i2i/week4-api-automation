import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
import { AuthAPI } from '../pom/auth.api';
import { profileSchema } from '../utils/schema.validator';

dotenv.config();

test.describe('Task 1: Login & Session', () => {
  let apiContext;
  let auth: AuthAPI;
  let accessToken: string;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    auth = new AuthAPI(apiContext);
  });

  test('Login → Fetch Profile → Validate Schema & Headers', async () => {
    // 1. Login
    const loginResp = await auth.login(process.env.USERNAME!, process.env.PASSWORD!);
    expect(loginResp.status()).toBe(200);

    const { accessToken: token } = await loginResp.json();
    accessToken = token;
    expect(accessToken).toBeTruthy();

    // 2. Fetch Profile
    const profileResp = await auth.getProfile(accessToken);
    expect(profileResp.status()).toBe(200);

    // ── NEW: validate response headers (e.g., content-type)
    const headers = profileResp.headers();
    expect(headers['content-type']).toContain('application/json');

    // 3. Schema validation
    const profileData = await profileResp.json();
    expect(profileSchema.safeParse(profileData).success).toBeTruthy();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
