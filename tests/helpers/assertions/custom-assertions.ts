import { Locator, Page, expect } from '@playwright/test';

/** Asserts a metric card has a visible numeric/formatted value and a trend indicator */
export async function expectMetricCard(card: Locator): Promise<void> {
  await expect(card).toBeVisible();
  const value = card.locator('[data-testid^="metric-value"]');
  const change = card.locator('[data-testid^="metric-change"]');
  await expect(value).toBeVisible();
  await expect(value).not.toHaveText('—');
  await expect(change).toBeVisible();
  await expect(change).toHaveClass(/up|down/);
}

/** Waits for a toast notification and checks it contains the expected message */
export async function expectToastNotification(page: Page, message: string): Promise<void> {
  const toast = page.getByTestId('undo-toast');
  await expect(toast).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('toast-message')).toContainText(message);
}
