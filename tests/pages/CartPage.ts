import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  // Scopes child locators to a single cart row by visible item name.
  private getCartItem(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  async getItems(): Promise<string[]> {
    return this.page
      .getByTestId('inventory-item')
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async removeItem(name: string): Promise<void> {
    await this.getCartItem(name).getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
