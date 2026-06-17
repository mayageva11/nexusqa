import { test, expect } from '../../fixtures/auth.fixture';
import { DashboardPage } from '../../helpers/page-objects/DashboardPage';

test.describe('Sidebar Navigation', () => {
  test('should navigate to analytics page @smoke', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await dashboard.navigateTo('analytics');
    await expect(adminPage).toHaveURL(/analytics/);
    await expect(adminPage.getByTestId('page-title')).toHaveText('Analytics');
  });

  test('should navigate to users page', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await dashboard.navigateTo('users');
    await expect(adminPage).toHaveURL(/users/);
  });

  test('should navigate to reports page', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await dashboard.navigateTo('reports');
    await expect(adminPage).toHaveURL(/reports/);
  });

  test('dashboard nav item should be active on dashboard page', async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
    await expect(adminPage.getByTestId('nav-dashboard')).toHaveClass(/active/);
  });

  test('analytics nav item should be active on analytics page', async ({ adminPage }) => {
    await adminPage.goto('/analytics');
    await expect(adminPage.getByTestId('nav-analytics')).toHaveClass(/active/);
  });
});
