import { test, expect, request } from '@playwright/test';

const MOCK_URL = 'http://localhost:3000';

test.describe('Task 3‑c: Role‑Based Access Control', () => {
  let apiContext;
  let tokenAlice: string, tokenBob: string;

  test.beforeAll(async () => {
    apiContext = await request.newContext();

    // Login as Alice (id=1)
    const respA = await apiContext.post(`${MOCK_URL}/auth/login`, {
      data: { username: 'alice', password: 'alicepass' }
    });
    expect(respA.status()).toBe(200);
    tokenAlice = (await respA.json()).accessToken;

    // Login as Bob (id=2)
    const respB = await apiContext.post(`${MOCK_URL}/auth/login`, {
      data: { username: 'bob', password: 'bobpass' }
    });
    expect(respB.status()).toBe(200);
    tokenBob = (await respB.json()).accessToken;
  });

  test('Alice can fetch her own profile (200)', async () => {
    const resp = await apiContext.get(`${MOCK_URL}/auth/profile/1`, {
      headers: { Authorization: `Bearer ${tokenAlice}` }
    });
    expect(resp.status()).toBe(200);
  });

  test('Bob cannot fetch Alice’s profile (403)', async () => {
    const resp = await apiContext.get(`${MOCK_URL}/auth/profile/1`, {
      headers: { Authorization: `Bearer ${tokenBob}` }
    });
    expect(resp.status()).toBe(403);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
    