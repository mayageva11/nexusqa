import { test, expect } from '../../fixtures/auth.fixture';
import { ReportsPage } from '../../helpers/page-objects/ReportsPage';

test.describe('Generate Report Wizard', () => {
  test.describe.configure({ mode: 'serial' });
  let reportsPage: ReportsPage;

  test.beforeEach(async ({ adminPage }) => {
    reportsPage = new ReportsPage(adminPage);
    await reportsPage.goto();
  });

  test('should open wizard on button click @smoke', async () => {
    await reportsPage.openWizard();
    await expect(reportsPage.reportWizard).toBeVisible();
    await expect(reportsPage.page.getByTestId('wizard-step-1')).toBeVisible();
  });

  test('should progress through all 3 wizard steps', async () => {
    await reportsPage.openWizard();
    await expect(reportsPage.page.getByTestId('wizard-step-1')).toBeVisible();
    await reportsPage.fillStep1('My Q3 Report', 'traffic');
    await expect(reportsPage.page.getByTestId('wizard-step-2')).toBeVisible();
    await reportsPage.completeStep2();
    await expect(reportsPage.page.getByTestId('wizard-step-3')).toBeVisible();
  });

  test('should generate report and show in list', async ({ adminPage }) => {
    const reportName = `Test Report ${Date.now()}`;
    await reportsPage.openWizard();
    await reportsPage.fillStep1(reportName, 'revenue');
    await reportsPage.completeStep2();
    await reportsPage.confirmGenerate();
    await expect(adminPage.getByTestId('reports-list').getByText(reportName)).toBeVisible();
  });

  test('should not advance from step 1 without filling required fields', async ({ adminPage }) => {
    await reportsPage.openWizard();
    await adminPage.getByTestId('wizard-next-1').click();
    await expect(adminPage.getByTestId('wizard-step-1')).toBeVisible();
  });

  test('download CSV button should be present on reports', async ({ adminPage }) => {
    await expect(adminPage.getByTestId('download-report-btn').first()).toBeVisible();
  });
});
