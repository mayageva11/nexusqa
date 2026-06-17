import { test, expect } from '../fixtures/api.fixture';

test.describe('Auth API', () => {
  test('POST /api/auth/login returns 200 and token with valid credentials @smoke', async ({ unauthApi }) => {
    const res = await unauthApi.post('/api/auth/login', {
      data: { email: 'admin@luminary.io', password: 'Test1234!' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json() as { token: string; user: { email: string; role: string } };
    expect(body.token).toBeTruthy();
    expect(body.token.split('.')).toHaveLength(3);
    expect(body.user.email).toBe('admin@luminary.io');
    expect(body.user.role).toBe('admin');
  });

  test('POST /api/auth/login returns 401 for invalid password @smoke', async ({ unauthApi }) => {
    const res = await unauthApi.post('/api/auth/login', {
      data: { email: 'admin@luminary.io', password: 'wrongpassword' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json() as { error: string };
    expect(body.error).toContain('Invalid credentials');
  });

  test('POST /api/auth/login returns 400 when email is missing', async ({ unauthApi }) => {
    const res = await unauthApi.post('/api/auth/login', {
      data: { password: 'Test1234!' },
    });
    expect(res.status()).toBe(400);
  });

  test('POST /api/auth/login returns 400 when password is missing', async ({ unauthApi }) => {
    const res = await unauthApi.post('/api/auth/login', {
      data: { email: 'admin@luminary.io' },
    });
    expect(res.status()).toBe(400);
  });

  test('valid token grants access to GET /api/auth/me', async ({ adminApi }) => {
    const res = await adminApi.get('/api/auth/me');
    expect(res.status()).toBe(200);
    const body = await res.json() as { email: string };
    expect(body.email).toBe('admin@luminary.io');
  });

  test('request without token returns 401', async ({ unauthApi }) => {
    const res = await unauthApi.get('/api/auth/me');
    expect(res.status()).toBe(401);
  });

  test('request with invalid token returns 403', async ({ unauthApi }) => {
    const res = await unauthApi.get('/api/auth/me', {
      headers: { Authorization: 'Bearer thisisnotavalidtoken' },
    });
    expect(res.status()).toBe(403);
  });

  test('POST /api/auth/logout invalidates the token', async ({ unauthApi }) => {
    const loginRes = await unauthApi.post('/api/auth/login', {
      data: { email: 'editor@luminary.io', password: 'Test1234!' },
    });
    const { token } = await loginRes.json() as { token: string };

    const logoutRes = await unauthApi.post('/api/auth/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(logoutRes.status()).toBe(200);

    const meRes = await unauthApi.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(meRes.status()).toBe(403);
  });
});
