import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    inventoryPage = new InventoryPage(authenticatedPage);
  });

  test(
    'products page lists exactly 6 items',
    { tag: '@smoke' },
    async ({ authenticatedPage }) => {
      await expect(authenticatedPage.getByTestId('inventory-item')).toHaveCount(6);
    },
  );

  test(
    'sorting by Name Z-A reorders the list with Test.allTheThings() T-Shirt first',
    { tag: '@regression' },
    async () => {
      await inventoryPage.sortBy('za');

      const names = await inventoryPage.getProductNames();
      expect(names[0]).toBe('Test.allTheThings() T-Shirt (Red)');
    },
  );

  test(
    'sorting by Price low to high shows Sauce Labs Onesie ($7.99) first',
    { tag: '@regression' },
    async () => {
      await inventoryPage.sortBy('lohi');

      const names = await inventoryPage.getProductNames();
      expect(names[0]).toBe('Sauce Labs Onesie');
    },
  );

  test(
    'adding one item to the cart updates the cart badge to 1',
    { tag: '@smoke' },
    async () => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');

      await expect(inventoryPage.cartBadge).toHaveText('1');
    },
  );

  test(
    'removing the only cart item clears the cart badge',
    { tag: '@regression' },
    async () => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await expect(inventoryPage.cartBadge).toBeVisible();

      await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
      await expect(inventoryPage.cartBadge).not.toBeVisible();
    },
  );
});
