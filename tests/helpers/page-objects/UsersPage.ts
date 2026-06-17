import { Page, Locator, expect } from '@playwright/test';

export class UsersPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly roleFilter: Locator;
  readonly addUserButton: Locator;
  readonly usersTable: Locator;
  readonly usersTableBody: Locator;
  readonly pagination: Locator;
  readonly userModal: Locator;
  readonly deleteDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.roleFilter = page.getByTestId('role-filter');
    this.addUserButton = page.getByTestId('add-user-btn');
    this.usersTable = page.getByTestId('users-table');
    this.usersTableBody = page.getByTestId('users-table-body');
    this.pagination = page.getByTestId('pagination');
    this.userModal = page.getByTestId('user-modal');
    this.deleteDialog = page.getByTestId('delete-dialog');
  }

  async goto(): Promise<void> {
    await this.page.goto('/users');
    await this.page.waitForURL(/users/, { timeout: 10000 });
    await expect(this.usersTable).toBeVisible({ timeout: 15000 });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(300);
  }

  async openAddModal(): Promise<void> {
    await this.addUserButton.click();
    await expect(this.userModal).toBeVisible();
  }

  async fillUserForm(name: string, email: string, role: string): Promise<void> {
    await this.page.getByTestId('user-name-input').fill(name);
    await this.page.getByTestId('user-email-input').fill(email);
    await this.page.getByTestId('user-role-select').selectOption(role);
  }

  async submitUserForm(): Promise<void> {
    await this.page.getByTestId('modal-submit').click();
  }

  async cancelModal(): Promise<void> {
    await this.page.getByTestId('modal-cancel').click();
  }

  userRows(): Locator {
    return this.page.getByTestId('user-row');
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByTestId('delete-confirm').click();
  }

  async cancelDelete(): Promise<void> {
    await this.page.getByTestId('delete-cancel').click();
  }

  async sortBy(column: string): Promise<void> {
    await this.page.getByTestId(`sort-${column}`).click();
  }

  async expectRowCount(count: number): Promise<void> {
    await expect(this.userRows()).toHaveCount(count);
  }
}
