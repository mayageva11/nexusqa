import { test as base, Page } from '@playwright/test';
import * as path from 'path';

interface AuthFixtures {
  adminPage: Page;
  editorPage: Page;
  viewerPage: Page;
}

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ browser }, use) => {
    const storageState = path.join(__dirname, '../auth-state/admin.auth.json');
    const ctx = await browser.newContext({ storageState });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },

  editorPage: async ({ browser }, use) => {
    const storageState = path.join(__dirname, '../auth-state/editor.auth.json');
    const ctx = await browser.newContext({ storageState });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },

  viewerPage: async ({ browser }, use) => {
    const storageState = path.join(__dirname, '../auth-state/viewer.auth.json');
    const ctx = await browser.newContext({ storageState });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

export { expect } from '@playwright/test';
