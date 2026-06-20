import { defineConfig, devices } from '@playwright/test';

const vpW = process.env.PLAYWRIGHT_VIEWPORT_WIDTH ? parseInt(process.env.PLAYWRIGHT_VIEWPORT_WIDTH, 10) : undefined;
const vpH = process.env.PLAYWRIGHT_VIEWPORT_HEIGHT ? parseInt(process.env.PLAYWRIGHT_VIEWPORT_HEIGHT, 10) : undefined;
const viewport = vpW && vpH ? { width: vpW, height: vpH } : undefined;

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3001',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], ...(viewport ? { viewport } : {}) },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], ...(viewport ? { viewport } : {}) },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], ...(viewport ? { viewport } : {}) },
    },
  ],
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
});
