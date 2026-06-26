import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../../test-data/users';

// The serialised cookies + localStorage that context.storageState() returns.
type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>;

// Fixtures created fresh for every single test.
type AuthFixtures = {
  authenticatedPage: Page;
};

// Fixtures created once per worker process and shared by every test that
// worker runs. This is where the one-time login lives.
type AuthWorkerFixtures = {
  standardStorageState: StorageState;
};

export const test = base.extend<AuthFixtures, AuthWorkerFixtures>({
  // --- worker fixture: drive the login form ONCE per worker ---
  standardStorageState: [
    async ({ browser }, use) => {
      // A throwaway page used only to perform the real UI login.
      const page = await browser.newPage();

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(USERS.standard.username, USERS.standard.password);

      // Make sure the session cookie is actually set before we snapshot it.
      await page.waitForURL('**/inventory.html');

      // Serialise the authenticated session into a plain object.
      const state = await page.context().storageState();
      await page.close();

      // Share this session with every test in the worker.
      await use(state);
    },
    { scope: 'worker' },
  ],

  // --- per-test fixture: a page that is ALREADY logged in ---
  authenticatedPage: async ({ browser, standardStorageState }, use) => {
    // A fresh, isolated context seeded with the saved session.
    // No form, no click — the session is injected directly.
    const context = await browser.newContext({ storageState: standardStorageState });
    const page = await context.newPage();

    // Start on the inventory page, exactly where the old fixture left tests.
    await page.goto('/inventory.html');

    await use(page);

    // Each test gets its own context, so tear it down here.
    await context.close();
  },
});

export { expect } from '@playwright/test';