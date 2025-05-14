import { expect, type Page } from '@playwright/test';

/**
 * Creates a test user account with the specified email and username
 */
export async function createTestAccount(page: Page, email = 'e2e@test.com', username = 'testuser') {
  await page.goto('/signup');

  // Step 1: Email submission
  await page.getByLabel('Email address').fill(email);
  await page.locator('#form-button').click();

  // Step 2: Verification code
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');
  await page.locator('#form-button').click();

  // Step 3: Username and password
  const usernameInput = page.getByLabel('Username');
  await expect(usernameInput).toBeVisible();
  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await expect(passwordInput).toBeVisible();

  await usernameInput.fill(username);
  await passwordInput.fill('SecurePassword123');
  await page.locator('#form-button').click();
}

/**
 * Signs out the currently logged in user
 */
export async function signOut(page: Page) {
  await page.getByTestId('avatar-menu-trigger').click();
  await page.getByRole('menuitem', { name: /sign out/i }).click();
}
