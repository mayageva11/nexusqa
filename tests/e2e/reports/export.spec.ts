import { test, expect } from '../../fixtures/auth.fixture';
import { ReportsPage } from '../../helpers/page-objects/ReportsPage';
import { expectToastNotification } from '../../helpers/assertions/custom-assertions';

test.describe('Report Export and Delete', () => {
  test.describe.configure({ mode: 'serial' });
  let reportsPage: ReportsPage;

  test.beforeEach(async ({ adminPage }) => {
    reportsPage = new ReportsPage(adminPage);
    await reportsPage.goto();
  });

  test('should show undo toast after deleting a report @smoke', async () => {
    await reportsPage.deleteFirstReport();
    await expectToastNotification(reportsPage.page, 'deleted');
  });

  test('should restore report after clicking undo', async ({ adminPage }) => {
    const firstReportName = await adminPage
      .getByTestId('report-name').first().textContent();
    await reportsPage.deleteFirstReport();
    await adminPage.getByTestId('undo-btn').click();
    if (firstReportName) {
      await expect(adminPage.getByTestId('reports-list').getByText(firstReportName)).toBeVisible();
    }
  });

  test('report list should have at least one report', async () => {
    const cards = reportsPage.reportCards();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('each report should show status badge', async ({ adminPage }) => {
    await expect(adminPage.getByTestId('report-status').first()).toBeVisible();
    const status = await adminPage.getByTestId('report-status').first().textContent();
    expect(status).toBe('ready');
  });
});
