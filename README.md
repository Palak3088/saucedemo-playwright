# SauceDemo E2E Automation — Playwright + TypeScript

[![Playwright Tests](https://github.com/Palak3088/saucedemo-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Palak3088/saucedemo-playwright/actions/workflows/playwright.yml)

End-to-end test suite for [SauceDemo](https://www.saucedemo.com), built with Playwright and TypeScript.

---

## Overview

This project demonstrates a maintainable, scalable E2E automation architecture: a Page Object Model, typed test data, a reusable authentication fixture, and a three-browser CI pipeline via GitHub Actions. It is tested against the SauceDemo demo e-commerce application, covering the full user journey from login through to order confirmation.

---

## Tech Stack

| Tool | Role |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation and test runner |
| TypeScript | Type-safe test and page object code |
| Page Object Model | Encapsulates locators and actions per page |
| GitHub Actions | CI pipeline across Chromium, Firefox, and WebKit |

---

## What's Covered

16 tests across 4 suites, run against all three browser engines on every CI build.

| Suite | Test | Tags |
|---|---|---|
| **Login** | Valid credentials → lands on inventory page | `@smoke` |
| **Login** | Locked-out user → lockout error message | `@regression` |
| **Login** | Wrong password → invalid credentials error | `@regression` |
| **Login** | Empty username → validation error | `@regression` |
| **Login** | Empty password → validation error | `@regression` |
| **Inventory** | Products page lists exactly 6 items | `@smoke` |
| **Inventory** | Add item → cart badge updates to 1 | `@smoke` |
| **Inventory** | Remove item → cart badge clears | `@regression` |
| **Inventory** | Sort by Name Z→A → correct first item | `@regression` |
| **Inventory** | Sort by Price low→high → correct first item | `@regression` |
| **Cart** | Added item appears in the cart | `@smoke` |
| **Cart** | Continue Shopping → returns to inventory | `@regression` |
| **Cart** | Remove item → cart is empty | `@regression` |
| **Checkout** | Full purchase flow → order confirmation | `@smoke` `@e2e` |
| **Checkout** | Missing first name → validation error | `@regression` |
| **Checkout** | Order overview shows correct item count | `@regression` |

**Tag legend**

| Tag | Meaning |
|---|---|
| `@smoke` | Critical happy-path tests — run first to verify core functionality |
| `@regression` | Negative and edge cases — full regression coverage |
| `@e2e` | Complete end-to-end journey spanning every page in the flow |

Run a specific tag:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @e2e
```

---

## Project Structure

```
saucedemo-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI pipeline: test + upload report
├── test-data/
│   └── users.ts                  # Typed SauceDemo credentials (all 6 users)
├── tests/
│   ├── e2e/                      # Spec files — one subfolder per feature area
│   │   ├── auth/
│   │   │   └── login.spec.ts
│   │   ├── inventory/
│   │   │   └── inventory.spec.ts
│   │   ├── cart/
│   │   │   └── cart.spec.ts
│   │   └── checkout/
│   │       └── checkout.spec.ts
│   ├── fixtures/
│   │   └── auth.fixture.ts       # Reusable authenticated-page fixture
│   └── pages/                    # Page Object Model classes
│       ├── base.page.ts          # Abstract base (navigate, getTitle)
│       ├── LoginPage.ts
│       ├── InventoryPage.ts
│       ├── CartPage.ts
│       └── CheckoutPage.ts
├── playwright.config.ts          # Browsers, baseURL, retries, reporters
├── tsconfig.json
└── package.json
```

---

## How to Run

```bash
# 1. Clone and install
git clone https://github.com/Palak3088/saucedemo-playwright.git
cd saucedemo-playwright
npm install

# 2. Install browser binaries
npx playwright install

# 3. Run the full suite (headless, all browsers)
npx playwright test

# Run smoke tests only
npx playwright test --grep @smoke

# Run a single spec file
npx playwright test tests/e2e/auth/login.spec.ts

# Open interactive UI mode
npx playwright test --ui

# View the HTML report after a run
npx playwright show-report
```

---

## Continuous Integration

The suite runs automatically on every push and pull request to `main` via GitHub Actions. The workflow runs all 48 tests (16 tests × 3 browsers) on Ubuntu, installs browser binaries with system dependencies, and uploads the HTML report as a downloadable artifact for 30 days — available from the workflow summary page whether the run passed or failed.

---

## Development notes

Built with Playwright + TypeScript using an AI-assisted workflow (Claude Code) for scaffolding and boilerplate. Architecture, coverage scope, and locator/fixture strategy are my own design decisions.

---

## About

QA/Automation Engineer passionate about building reliable, maintainable test frameworks — [LinkedIn](https://www.linkedin.com/in/palakagarwal3088/)
