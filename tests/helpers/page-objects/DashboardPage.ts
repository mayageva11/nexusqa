import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly pageTitle: Locator;
  readonly metricsGrid: Locator;
  readonly activityChart: Locator;
  readonly trafficChart: Locator;
  readonly activityFeed: Locator;
  readonly logoutButton: Locator;
  readonly notificationBell: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.getByTestId('sidebar');
    this.pageTitle = page.getByTestId('page-title');
    this.metricsGrid = page.getByTestId('metrics-grid');
    this.activityChart = page.getByTestId('activity-chart');
    this.trafficChart = page.getByTestId('traffic-chart');
    this.activityFeed = page.getByTestId('activity-feed');
    this.logoutButton = page.getByTestId('logout-btn');
    this.notificationBell = page.getByTestId('notification-bell');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.page.waitForURL(/dashboard/, { timeout: 10000 });
    await expect(this.metricsGrid).toBeVisible({ timeout: 15000 });
  }

  metricCard(id: string): Locator {
    return this.page.getByTestId(`metric-card-${id}`);
  }

  metricValue(id: string): Locator {
    return this.page.getByTestId(`metric-value-${id}`);
  }

  metricChange(id: string): Locator {
    return this.page.getByTestId(`metric-change-${id}`);
  }

  async navigateTo(section: string): Promise<void> {
    await this.page.getByTestId(`nav-${section}`).click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }

  async expectFullyLoaded(): Promise<void> {
    await expect(this.metricsGrid).toBeVisible();
    await expect(this.activityChart).toBeVisible();
    await expect(this.activityFeed).toBeVisible();
    for (const id of ['revenue', 'active-users', 'conversion-rate', 'avg-session']) {
      await expect(this.metricValue(id)).not.toHaveText('—');
    }
  }
}
