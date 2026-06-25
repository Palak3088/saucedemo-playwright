import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // SauceDemo's login fields have no <label> elements, so getByPlaceholder is
    // the most semantic option (preferred over CSS ids or data-test here).
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    // <input type="submit"> carries the implicit ARIA role "button".
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // Error banner has data-test="error" — resolved via testIdAttribute config.
    this.errorMessage = page.getByTestId('error');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
