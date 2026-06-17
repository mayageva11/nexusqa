import { test as base, APIRequestContext, request } from '@playwright/test';

interface ApiFixtures {
  adminApi: APIRequestContext;
  unauthApi: APIRequestContext;
}

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3001';

export const test = base.extend<ApiFixtures>({
  adminApi: async ({}, use) => {
    const ctx = await request.newContext({ baseURL: BASE_URL });
    const res = await ctx.post('/api/auth/login', {
      data: { email: 'admin@luminary.io', password: 'Test1234!' },
    });
    const { token } = await res.json() as { token: string };
    const authCtx = await request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    });
    await use(authCtx);
    await authCtx.dispose();
    await ctx.dispose();
  },

  unauthApi: async ({}, use) => {
    const ctx = await request.newContext({ baseURL: BASE_URL });
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect } from '@playwright/test';
