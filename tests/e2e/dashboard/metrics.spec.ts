import path from 'path';
import { test, expect } from '../../fixtures/auth.fixture';
import { DashboardPage } from '../../helpers/page-objects/DashboardPage';
import { expectMetricCard } from '../../helpers/assertions/custom-assertions';

const ADMIN_AUTH = path.join(__dirname, '../../auth-state/admin.auth.json');

const METRIC_IDS = ['revenue', 'active-users', 'conversion-rate', 'avg-session'];

test.describe('Dashboard Metrics', () => {
  test('should display all 4 metric cards @smoke', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    for (const id of METRIC_IDS) {
      await expect(dashboard.metricCard(id)).toBeVisible();
    }
  });

  test('each metric card should show a numeric value', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await dashboard.expectFullyLoaded();
    for (const id of METRIC_IDS) {
      const text = await dashboard.metricValue(id).textContent();
      expect(text).toBeTruthy();
      expect(text).not.toBe('—');
    }
  });

  test('each metric card should show a trend direction indicator', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await dashboard.expectFullyLoaded();
    for (const id of METRIC_IDS) {
      await expectMetricCard(dashboard.metricCard(id));
    }
  });

  test('activity chart canvas should render with data', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await expect(dashboard.activityChart).toBeVisible();
    const width = await dashboard.activityChart.evaluate((el: HTMLCanvasElement) => el.width);
    expect(width).toBeGreaterThan(0);
  });

  test('traffic chart canvas should be visible', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await expect(dashboard.trafficChart).toBeVisible();
  });

  test('should display correctly at 1280px viewport', async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: ADMIN_AUTH,
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.metricsGrid).toBeVisible();
    await ctx.close();
  });

  test('should display correctly at 768px viewport', async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: ADMIN_AUTH,
      viewport: { width: 768, height: 1024 },
    });
    const page = await ctx.newPage();
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.metricsGrid).toBeVisible();
    await ctx.close();
  });
});
