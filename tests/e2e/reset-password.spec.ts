import { expect, test } from '@playwright/test';
import { deleteTestAccount } from './utils/test-account';

test('Reset password page has correct UI elements', async ({ page }) => {
  await page.goto('/reset-password');

  // Check for the auth card with correct title
  const authCard = page.getByRole('heading', { name: 'Reset your password' });
  await expect(authCard).toBeVisible();

  // Check for form inputs in step 1
  const emailInput = page.getByLabel('Username or email');
  await expect(emailInput).toBeVisible();

  // Check for button
  const resetButton = page.locator('#form-button');
  await expect(resetButton).toBeVisible();
  await expect(resetButton).toHaveText('Send me an email');
});

test('Reset password flow - complete process', async ({ page }) => {
  await page.goto('/signup');

  // Step 1: Email submission
  await page.getByLabel('Email address').fill('e2e@test.com');

  // Click sign up button
  await page.locator('#form-button').click();

  // Step 2: Verification code
  // Wait for the OTP input to appear
  const otpInput = page.locator('#verification-code');
  await expect(otpInput.first()).toBeVisible();

  // Enter verification code
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Click submit button
  await page.locator('#form-button').click();
  // Sign out the user
  await page.getByTestId('avatar-menu-trigger').click();
  await page.getByRole('menuitem', { name: /sign out/i }).click();

  // Verify redirection to sign in page
  await expect(page).toHaveURL('/signin');

  await page.goto('/reset-password');

  // Step 1: Enter email and request reset
  await page.getByLabel('Username or email').fill('e2e@test.com');

  // Click the reset button
  await page.locator('#form-button').click();

  // Step 2: Set new password
  // Wait for password input to appear
  const passwordInput = page.getByLabel('New password');
  await expect(passwordInput).toBeVisible();

  // Enter new password
  await passwordInput.fill('NewSecurePassword123');

  // Step 3: Enter verification code
  // Wait for verification step to appear
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  // Enter the OTP code
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Click verify button
  await page.locator('#form-button').click();

  // Verify redirection to home page
  await expect(page).toHaveURL('/');

  await deleteTestAccount(page);
});
