import { test as base } from '@playwright/test';
import { generateTestUsers, TestUser } from '../helpers/claude-generator';

interface TestDataFixtures {
  claudeGeneratedUsers: TestUser[];
}

export const test = base.extend<TestDataFixtures>({
  claudeGeneratedUsers: async ({}, use) => {
    const users = await generateTestUsers(5);
    await use(users);
  },
});

export { expect } from '@playwright/test';
