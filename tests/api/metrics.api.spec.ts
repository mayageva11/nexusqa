import { test, expect } from '../fixtures/api.fixture';

test.describe('Metrics API', () => {
  test('GET /api/metrics returns all expected fields @smoke', async ({ adminApi }) => {
    const res = await adminApi.get('/api/metrics');
    expect(res.status()).toBe(200);
    const body = await res.json() as {
      cards: unknown[];
      series: unknown[];
      trafficSources: unknown[];
      topPages: unknown[];
    };
    expect(Array.isArray(body.cards)).toBe(true);
    expect(Array.isArray(body.series)).toBe(true);
    expect(Array.isArray(body.trafficSources)).toBe(true);
    expect(Array.isArray(body.topPages)).toBe(true);
  });

  test('should return exactly 4 metric cards', async ({ adminApi }) => {
    const res = await adminApi.get('/api/metrics');
    const body = await res.json() as { cards: Array<{ id: string }> };
    expect(body.cards).toHaveLength(4);
  });

  test('each metric card should have required shape', async ({ adminApi }) => {
    const res = await adminApi.get('/api/metrics');
    const body = await res.json() as {
      cards: Array<{ id: string; label: string; value: string; change: number; trend: string }>;
    };
    for (const card of body.cards) {
      expect(card.id).toBeTruthy();
      expect(card.label).toBeTruthy();
      expect(card.value).toBeTruthy();
      expect(typeof card.change).toBe('number');
      expect(['up', 'down']).toContain(card.trend);
    }
  });

  test('series should contain 30 days of data', async ({ adminApi }) => {
    const res = await adminApi.get('/api/metrics');
    const body = await res.json() as {
      series: Array<{ date: string; sessions: number; revenue: number }>;
    };
    expect(body.series).toHaveLength(30);
    for (const day of body.series) {
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(day.sessions).toBeGreaterThan(0);
      expect(day.revenue).toBeGreaterThan(0);
    }
  });

  test('GET /api/metrics returns 401 without token', async ({ unauthApi }) => {
    const res = await unauthApi.get('/api/metrics');
    expect(res.status()).toBe(401);
  });
});
