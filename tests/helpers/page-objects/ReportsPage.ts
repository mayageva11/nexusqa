import { Page, Locator, expect } from '@playwright/test';

export class ReportsPage {
  readonly page: Page;
  readonly generateButton: Locator;
  readonly reportsList: Locator;
  readonly reportWizard: Locator;
  readonly undoToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.generateButton = page.getByTestId('generate-report-btn');
    this.reportsList = page.getByTestId('reports-list');
    this.reportWizard = page.getByTestId('report-wizard');
    this.undoToast = page.getByTestId('undo-toast');
  }

  async goto(): Promise<void> {
    await this.page.goto('/reports');
    await this.page.waitForURL(/reports/, { timeout: 10000 });
    await expect(this.reportsList).toBeVisible({ timeout: 15000 });
  }

  async openWizard(): Promise<void> {
    await this.generateButton.click();
    await expect(this.reportWizard).toBeVisible();
  }

  async fillStep1(name: string, type: string): Promise<void> {
    await this.page.getByTestId('report-name-input').fill(name);
    await this.page.getByTestId('report-type-select').selectOption(type);
    await this.page.getByTestId('wizard-next-1').click();
  }

  async completeStep2(): Promise<void> {
    await this.page.getByTestId('wizard-next-2').click();
  }

  async confirmGenerate(): Promise<void> {
    await this.page.getByTestId('wizard-generate').click();
  }

  reportCards(): Locator {
    return this.page.getByTestId('report-card');
  }

  async deleteFirstReport(): Promise<void> {
    await this.page.getByTestId('delete-report-btn').first().click();
  }

  async undoDelete(): Promise<void> {
    await this.page.getByTestId('undo-btn').click();
  }
}
