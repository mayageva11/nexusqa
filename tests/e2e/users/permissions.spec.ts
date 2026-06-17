import { test, expect } from '../../fixtures/auth.fixture';

test.describe('User Role Permissions', () => {
  test('admin should see add user button', async ({ adminPage }) => {
    await adminPage.goto('/users');
    await expect(adminPage.getByTestId('add-user-btn')).toBeVisible();
  });

  test('viewer should still see users table', async ({ viewerPage }) => {
    await viewerPage.goto('/users');
    await expect(viewerPage.getByTestId('users-table')).toBeVisible();
  });

  test('admin should see delete buttons on user rows', async ({ adminPage }) => {
    await adminPage.goto('/users');
    const deleteButtons = adminPage.getByTestId('delete-user-btn');
    await expect(deleteButtons.first()).toBeVisible();
  });

  test('all roles should be able to view the dashboard', async ({ viewerPage, editorPage }) => {
    for (const page of [viewerPage, editorPage]) {
      await page.goto('/dashboard');
      await expect(page.getByTestId('metrics-grid')).toBeVisible();
    }
  });
});
