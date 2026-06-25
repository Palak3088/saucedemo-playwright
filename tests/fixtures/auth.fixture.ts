import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../../test-data/users';

// Declare the shape of the custom fixtures this file adds.
// Playwright merges this type with its built-in fixtures so TypeScript
// knows about authenticatedPage alongside page, browser, etc.
type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  // Each fixture is an async generator: do setup, yield the value via use(),
  // then do teardown. Playwright calls use() exactly once per test.
  authenticatedPage: async ({ page }, use) => {
    // --- setup: runs before the test body ---
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Hand the authenticated page to the test (or beforeEach).
    // Execution pauses here until the test finishes.
    await use(page);

    // --- teardown: runs after the test body ---
    // Nothing extra needed here — Playwright closes the page automatically.
    // Add cleanup (e.g. clear storage, reset DB) here if ever required.
  },
});

export { expect } from '@playwright/test';
