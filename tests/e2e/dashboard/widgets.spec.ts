import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Dashboard Widgets', () => {
  test('activity feed should display items', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    const feed = adminPage.getByTestId('activity-feed');
    await expect(feed).toBeVisible();
    await expect(adminPage.getByTestId('activity-item').first()).toBeVisible();
  });

  test('activity items should show timestamps', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    const timestamp = adminPage.getByTestId('activity-timestamp').first();
    await expect(timestamp).toBeVisible();
    const text = await timestamp.textContent();
    expect(text).toBeTruthy();
  });

  test('notification bell should be visible in header', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    await expect(adminPage.getByTestId('notification-bell')).toBeVisible();
  });

  test('user avatar should show initials in header', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    const avatar = adminPage.getByTestId('user-avatar');
    await expect(avatar).toBeVisible();
    const text = await avatar.textContent();
    expect(text).toMatch(/^[A-Z]{2}$/);
  });
});
