import { test, expect } from '@playwright/test';

async function loginFresh(page: Parameters<typeof test.fn>[0]['page']) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('editor@luminary.io');
  await page.getByTestId('password-input').fill('Test1234!');
  await page.getByTestId('login-submit').click();
  await page.waitForURL(/dashboard/);
}

// Each test logs in fresh so the shared auth-state tokens are never invalidated
test.describe('Logout', () => {
  test('should log out and redirect to login page @smoke', async ({ page }) => {
    await loginFresh(page);
    await page.getByTestId('logout-btn').click();
    await expect(page).toHaveURL(/login/);
  });

  test('should clear localStorage token on logout', async ({ page }) => {
    await loginFresh(page);
    await page.getByTestId('logout-btn').click();
    await page.waitForURL(/login/);
    const token = await page.evaluate(() => localStorage.getItem('luminary_token'));
    expect(token).toBeNull();
  });

  test('should redirect to login when accessing protected route after logout', async ({ page }) => {
    await loginFresh(page);
    await page.getByTestId('logout-btn').click();
    await page.waitForURL(/login/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });
});
