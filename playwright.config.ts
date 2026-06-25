import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Where Playwright looks for test files.
  testDir: './tests/e2e',

  // Run every test file in parallel across workers.
  fullyParallel: true,

  // Fail the CI build if anyone accidentally committed a test.only().
  forbidOnly: !!process.env.CI,

  // Retry every failing test up to 2 times before marking it failed.
  // Retries help distinguish genuine failures from transient network flakes.
  retries: 2,

  // On CI use a single worker to avoid overloading the agent.
  // Locally, Playwright picks a sensible default based on CPU count.
  workers: process.env.CI ? 1 : undefined,

  // HTML reporter writes a self-contained report to playwright-report/.
  // `open: 'never'` prevents the browser auto-opening after local runs;
  // view it manually with: npx playwright show-report
  // The list reporter prints a live result line per test in the terminal.
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    // All page.goto('/inventory.html') calls resolve against this origin.
    baseURL: 'https://www.saucedemo.com',

    // Makes page.getByTestId('x') match [data-test="x"] (SauceDemo's attribute).
    testIdAttribute: 'data-test',

    // Record a Playwright trace on the first retry of a failing test.
    // Traces include a DOM snapshot, network log, and action timeline.
    // View with: npx playwright show-trace <path-to-trace.zip>
    trace: 'on-first-retry',

    // Capture a full-page screenshot whenever a test fails.
    // Saved alongside the trace in test-results/.
    screenshot: 'only-on-failure',

    // Keep the video recording only when a test fails.
    video: 'retain-on-failure',

    // Maximum time a single action (click, fill, etc.) may take.
    actionTimeout: 10_000,

    // Maximum time a navigation (goto, waitForURL, etc.) may take.
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
