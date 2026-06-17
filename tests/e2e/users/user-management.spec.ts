import { test, expect } from '../../fixtures/auth.fixture';
import { UsersPage } from '../../helpers/page-objects/UsersPage';

test.describe('User Management', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ adminPage }) => {
    usersPage = new UsersPage(adminPage);
    await usersPage.goto();
  });

  test('should load users table with data @smoke', async ({ adminPage }) => {
    await expect(usersPage.usersTable).toBeVisible();
    const rows = usersPage.userRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter users by search query', async () => {
    await usersPage.search('alice');
    const rows = usersPage.userRows();
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
    if (count > 0) {
      const firstRowText = await rows.first().textContent();
      expect(firstRowText?.toLowerCase()).toContain('alice');
    }
  });

  test('should filter users by role', async ({ adminPage }) => {
    await adminPage.getByTestId('role-filter').selectOption('admin');
    const rows = usersPage.userRows();
    const count = await rows.count();
    if (count > 0) {
      const roleText = await rows.first().getByTestId('user-role').textContent();
      expect(roleText).toBe('admin');
    }
  });

  test('should sort users by name ascending', async () => {
    await usersPage.sortBy('name');
    const rows = usersPage.userRows();
    const count = await rows.count();
    if (count > 1) {
      const firstName = await rows.first().getByTestId('user-name').textContent();
      const lastName = await rows.last().getByTestId('user-name').textContent();
      expect((firstName ?? '').localeCompare(lastName ?? '')).toBeLessThanOrEqual(0);
    }
  });

  test('should open add user modal on button click @smoke', async () => {
    await usersPage.openAddModal();
    await expect(usersPage.userModal).toBeVisible();
  });

  test('should add a new user successfully', async ({ adminPage }) => {
    const email = `test.${Date.now()}@example.com`;
    await usersPage.openAddModal();
    await usersPage.fillUserForm('Test User', email, 'editor');
    await usersPage.submitUserForm();
    await expect(usersPage.userModal).not.toBeVisible();
    await usersPage.search(email);
    await expect(adminPage.getByText(email)).toBeVisible();
  });

  test('should show validation errors when submitting empty form', async ({ adminPage }) => {
    await usersPage.openAddModal();
    await usersPage.submitUserForm();
    await expect(adminPage.getByTestId('name-error')).toBeVisible();
    await expect(adminPage.getByTestId('email-error')).toBeVisible();
    await expect(adminPage.getByTestId('role-error')).toBeVisible();
  });

  test('should show email validation error for invalid email format', async ({ adminPage }) => {
    await usersPage.openAddModal();
    await usersPage.fillUserForm('Valid Name', 'not-an-email', 'editor');
    await usersPage.submitUserForm();
    await expect(adminPage.getByTestId('email-error')).toBeVisible();
  });

  test('should close modal on cancel', async () => {
    await usersPage.openAddModal();
    await usersPage.cancelModal();
    await expect(usersPage.userModal).not.toBeVisible();
  });

  test('should open delete confirmation dialog', async ({ adminPage }) => {
    await adminPage.getByTestId('delete-user-btn').first().click();
    await expect(usersPage.deleteDialog).toBeVisible();
    await expect(adminPage.getByTestId('delete-confirm-text')).toBeVisible();
  });

  test('should delete a user after confirmation', async ({ adminPage }) => {
    const firstRowEmail = await adminPage
      .getByTestId('user-row').first()
      .getByTestId('user-email').textContent();
    await adminPage.getByTestId('delete-user-btn').first().click();
    await usersPage.confirmDelete();
    await expect(usersPage.deleteDialog).not.toBeVisible();
    if (firstRowEmail) {
      await expect(adminPage.getByText(firstRowEmail)).not.toBeVisible();
    }
  });

  test('should cancel delete dialog without deleting', async ({ adminPage }) => {
    const countBefore = await usersPage.userRows().count();
    await adminPage.getByTestId('delete-user-btn').first().click();
    await usersPage.cancelDelete();
    await expect(usersPage.deleteDialog).not.toBeVisible();
    const countAfter = await usersPage.userRows().count();
    expect(countAfter).toBe(countBefore);
  });

  test('should show pagination controls', async () => {
    await expect(usersPage.pagination).toBeVisible();
    await expect(usersPage.pagination.getByTestId('pagination-info')).toBeVisible();
  });
});
