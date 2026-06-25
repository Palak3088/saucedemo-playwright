import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    // <select data-test="product-sort-container">
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  // Scopes all child locators to a single product card, matched by visible name.
  private getInventoryItem(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  async addItemToCart(name: string): Promise<void> {
    await this.getInventoryItem(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItemFromCart(name: string): Promise<void> {
    await this.getInventoryItem(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductCount(): Promise<number> {
    return this.page.getByTestId('inventory-item').count();
  }

  async getProductNames(): Promise<string[]> {
    return this.page
      .getByTestId('inventory-item')
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return parseInt((await this.cartBadge.textContent()) ?? '0', 10);
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
