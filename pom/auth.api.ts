import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthAPI {
  constructor(private request: APIRequestContext) {}

  async login(user: string, pass: string): Promise<APIResponse> {
    // DummyJSON returns "accessToken"
    return this.request.post(`${process.env.BASE_URL}/auth/login`, {
      data: { username: user, password: pass },
    });
  }

  async getProfile(token: string): Promise<APIResponse> {
    // The correct “me” endpoint
    return this.request.get(`${process.env.BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
