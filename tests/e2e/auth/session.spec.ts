import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Session Persistence', () => {
  test('should persist session across page reload', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    await expect(adminPage).toHaveURL(/dashboard/);
    await adminPage.reload();
    await expect(adminPage).toHaveURL(/dashboard/);
  });

  test('should have valid token in localStorage after login', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    const token = await adminPage.evaluate(() => localStorage.getItem('luminary_token'));
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    const parts = (token as string).split('.');
    expect(parts).toHaveLength(3);
  });

  test('should have user profile in localStorage after login', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    const userJson = await adminPage.evaluate(() => localStorage.getItem('luminary_user'));
    expect(userJson).toBeTruthy();
    const user = JSON.parse(userJson as string) as Record<string, unknown>;
    expect(user.email).toBe('admin@luminary.io');
    expect(user.role).toBe('admin');
  });
});
