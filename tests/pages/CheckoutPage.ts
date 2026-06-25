import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  // Step one — personal info form
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step two — order overview
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  // Step three — order confirmation
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    // <input type="submit" data-test="continue"> — testId is more stable than
    // getByRole here because "Continue" also appears in navigation elsewhere.
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');

    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');

    this.confirmationHeader = page.getByTestId('complete-header');
    this.confirmationText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInfo({ firstName, lastName, postalCode }: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async getConfirmationHeader(): Promise<string> {
    return (await this.confirmationHeader.textContent()) ?? '';
  }

  async isOrderComplete(): Promise<boolean> {
    return this.confirmationHeader.isVisible();
  }
}
