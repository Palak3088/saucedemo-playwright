import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    cartPage = new CartPage(authenticatedPage);
  });

  test(
    'cart page shows the item that was added from the inventory',
    { tag: '@smoke' },
    async ({ authenticatedPage }) => {
      await expect(authenticatedPage.getByTestId('inventory-item')).toHaveCount(1);

      const items = await cartPage.getItems();
      expect(items).toContain('Sauce Labs Backpack');
    },
  );

  test(
    'Continue Shopping navigates back to the products page',
    { tag: '@regression' },
    async ({ authenticatedPage }) => {
      await cartPage.continueShopping();

      await expect(authenticatedPage).toHaveURL('/inventory.html');
      await expect(authenticatedPage.getByTestId('title')).toHaveText('Products');
    },
  );

  test(
    'removing an item from the cart leaves the cart empty',
    { tag: '@regression' },
    async ({ authenticatedPage }) => {
      await cartPage.removeItem('Sauce Labs Backpack');

      await expect(authenticatedPage.getByTestId('inventory-item')).toHaveCount(0);
    },
  );
});
