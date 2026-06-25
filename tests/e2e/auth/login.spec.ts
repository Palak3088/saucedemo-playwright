import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../../test-data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test(
    'standard_user logs in with valid credentials and lands on the inventory page',
    { tag: '@smoke' },
    async ({ page }) => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);

      await expect(page).toHaveURL('/inventory.html');
      await expect(page.getByTestId('title')).toHaveText('Products');
    },
  );

  test(
    'locked_out_user is denied access and sees a lockout error message',
    { tag: '@regression' },
    async () => {
      await loginPage.login(USERS.locked.username, USERS.locked.password);

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('locked out');
    },
  );

  test(
    'wrong password shows an invalid credentials error',
    { tag: '@regression' },
    async () => {
      await loginPage.login(USERS.standard.username, 'wrong_password');

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    },
  );

  test(
    'empty username field is rejected with a username required error',
    { tag: '@regression' },
    async () => {
      await loginPage.login('', USERS.standard.password);

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username is required');
    },
  );

  test(
    'empty password field is rejected with a password required error',
    { tag: '@regression' },
    async () => {
      await loginPage.login(USERS.standard.username, '');

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Password is required');
    },
  );
});
