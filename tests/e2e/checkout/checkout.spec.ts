import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USERS } from '../../../test-data/users';

test.describe('Checkout', () => {
  let checkoutPage: CheckoutPage;

  // Drives every test to the checkout info form (step one).
  // Each test then continues the flow from that shared starting point.
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.checkout();

    checkoutPage = new CheckoutPage(page);
  });

  test(
    'full purchase flow completes and shows the order confirmation',
    { tag: ['@smoke', '@e2e'] },
    async () => {
      await checkoutPage.fillInfo({
        firstName: 'Jane',
        lastName: 'Doe',
        postalCode: '10001',
      });
      await checkoutPage.continue();
      await checkoutPage.finish();

      await expect(checkoutPage.confirmationHeader).toBeVisible();
      await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
    },
  );

  test(
    'submitting checkout without a first name shows a validation error',
    { tag: '@regression' },
    async () => {
      await checkoutPage.fillInfo({
        firstName: '',
        lastName: 'Doe',
        postalCode: '10001',
      });
      await checkoutPage.continue();

      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    },
  );

  test(
    'order overview lists the correct number of items before finishing',
    { tag: '@regression' },
    async ({ page }) => {
      await checkoutPage.fillInfo({
        firstName: 'Jane',
        lastName: 'Doe',
        postalCode: '10001',
      });
      await checkoutPage.continue();

      // One item was added in beforeEach — the overview must reflect exactly that
      await expect(page.getByTestId('inventory-item')).toHaveCount(1);
      await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    },
  );
});
