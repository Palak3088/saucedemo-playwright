import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout', () => {
  let checkoutPage: CheckoutPage;

  // The authenticatedPage fixture injects a saved session and lands on the
  // inventory page — no UI login required. Each test starts from the checkout
  // info form (step one) with one item already in the cart.
  test.beforeEach(async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(authenticatedPage);
    await cartPage.checkout();

    checkoutPage = new CheckoutPage(authenticatedPage);
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
    async ({ authenticatedPage }) => {
      await checkoutPage.fillInfo({
        firstName: 'Jane',
        lastName: 'Doe',
        postalCode: '10001',
      });
      await checkoutPage.continue();

      // One item was added in beforeEach — the overview must reflect exactly that
      await expect(authenticatedPage.getByTestId('inventory-item')).toHaveCount(1);
      await expect(authenticatedPage.getByText('Sauce Labs Backpack')).toBeVisible();
    },
  );
});