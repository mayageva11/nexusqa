import { test, expect } from '../fixtures/api.fixture';

test.describe('Users API', () => {
  test('GET /api/users returns paginated list @smoke', async ({ adminApi }) => {
    const res = await adminApi.get('/api/users');
    expect(res.status()).toBe(200);
    const body = await res.json() as { users: unknown[]; pagination: { total: number } };
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
    expect(body.pagination.total).toBeGreaterThan(0);
  });

  test('GET /api/users supports search query', async ({ adminApi }) => {
    const res = await adminApi.get('/api/users?search=alice');
    expect(res.status()).toBe(200);
    const body = await res.json() as { users: Array<{ name: string; email: string }> };
    for (const u of body.users) {
      const match = u.name.toLowerCase().includes('alice') || u.email.toLowerCase().includes('alice');
      expect(match).toBe(true);
    }
  });

  test('POST /api/users creates a new user', async ({ adminApi }) => {
    const email = `apitest.${Date.now()}@example.com`;
    const res = await adminApi.post('/api/users', {
      data: { name: 'API Test User', email, role: 'viewer' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json() as { id: string; email: string; role: string };
    expect(body.email).toBe(email);
    expect(body.role).toBe('viewer');
    expect(body.id).toBeTruthy();
  });

  test('POST /api/users returns 400 for missing required fields', async ({ adminApi }) => {
    const res = await adminApi.post('/api/users', {
      data: { name: 'Incomplete User' },
    });
    expect(res.status()).toBe(400);
  });

  test('PUT /api/users/:id updates user role', async ({ adminApi }) => {
    const createRes = await adminApi.post('/api/users', {
      data: { name: 'Edit Me', email: `edit.${Date.now()}@example.com`, role: 'viewer' },
    });
    const created = await createRes.json() as { id: string };
    const updateRes = await adminApi.put(`/api/users/${created.id}`, {
      data: { role: 'editor' },
    });
    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json() as { role: string };
    expect(updated.role).toBe('editor');
  });

  test('DELETE /api/users/:id removes user', async ({ adminApi }) => {
    const createRes = await adminApi.post('/api/users', {
      data: { name: 'Delete Me', email: `delete.${Date.now()}@example.com`, role: 'viewer' },
    });
    const created = await createRes.json() as { id: string };
    const deleteRes = await adminApi.delete(`/api/users/${created.id}`);
    expect(deleteRes.status()).toBe(200);
    const getRes = await adminApi.get(`/api/users/${created.id}`);
    expect(getRes.status()).toBe(404);
  });

  test('GET /api/users/:id returns 404 for non-existent user', async ({ adminApi }) => {
    const res = await adminApi.get('/api/users/non-existent-id-000');
    expect(res.status()).toBe(404);
  });
});
