import { test, expect } from '@playwright/test';
import { LoginPage } from '../../helpers/page-objects/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should log in with valid admin credentials @smoke', async ({ page }) => {
    await loginPage.loginAndWaitForDashboard('admin@luminary.io', 'Test1234!');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should log in with valid editor credentials', async ({ page }) => {
    await loginPage.loginAndWaitForDashboard('editor@luminary.io', 'Test1234!');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error message when password is incorrect @smoke', async () => {
    await loginPage.login('admin@luminary.io', 'wrongpassword');
    await loginPage.expectError('Invalid credentials');
  });

  test('should show error message when email is not registered', async () => {
    await loginPage.login('nobody@example.com', 'Test1234!');
    await loginPage.expectError('Invalid credentials');
  });

  test('should show error when email field is empty', async () => {
    await loginPage.login('', 'Test1234!');
    await loginPage.expectError('Email address is required');
  });

  test('should show error when password field is empty', async () => {
    await loginPage.login('admin@luminary.io', '');
    await loginPage.expectError('Password is required');
  });

  test('should not be vulnerable to SQL injection in email field', async () => {
    await loginPage.login("' OR '1'='1' --", 'anything');
    await loginPage.expectError('Invalid credentials');
  });

  test('should handle very long input without crashing', async () => {
    const longEmail = 'a'.repeat(200) + '@example.com';
    const longPassword = 'b'.repeat(300);
    await loginPage.login(longEmail, longPassword);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should set remember me flag in localStorage', async ({ page }) => {
    await loginPage.rememberMeCheckbox.check();
    await loginPage.loginAndWaitForDashboard('admin@luminary.io', 'Test1234!');
    const remember = await page.evaluate(() => localStorage.getItem('luminary_remember'));
    expect(remember).toBe('true');
  });

  test('should redirect to dashboard if already authenticated', async ({ page }) => {
    await loginPage.loginAndWaitForDashboard('admin@luminary.io', 'Test1234!');
    await page.goto('/login');
    await expect(page).toHaveURL(/dashboard/);
  });
});
