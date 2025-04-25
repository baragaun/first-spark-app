import { expect, test } from '@playwright/test';
import { deleteTestAccount } from './utils/test-account';

test('Sign in page has correct UI elements', async ({ page }) => {
  await page.goto('/signin');

  // Check for the auth card with correct title
  const authCard = page.getByRole('heading', { name: 'Sign in' });
  await expect(authCard).toBeVisible();

  // Check for form inputs
  const emailInput = page.getByLabel('Email or Username');
  await expect(emailInput).toBeVisible();

  // Use a more specific selector for password input
  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await expect(passwordInput).toBeVisible();

  // Check for buttons
  const signInButton = page.locator('#form-button');
  await expect(signInButton).toBeVisible();

  const tokenButton = page.getByRole('button', { name: 'Sign in with token' });
  await expect(tokenButton).toBeVisible();

  const forgotPasswordLink = page.getByRole('button', { name: 'Forgot your password?' });
  await expect(forgotPasswordLink).toBeVisible();

  // Check for sign up link
  const signUpLink = page.getByRole('link', { name: 'Sign up' });
  await expect(signUpLink).toBeVisible();
});

test('Sign in with password flow', async ({ page }) => {
  await page.goto('/signup');

  // Step 1: Email submission
  await page.getByLabel('Email address').fill('e2e@test.com');

  // Click sign up button
  await page.locator('#form-button').click();

  // Step 2: Verification code
  // Wait for the OTP input to appear
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  // Enter verification code
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Click submit button
  await page.locator('#form-button').click();

  // Step 3: Username and password
  // Wait for username and password fields to appear
  const usernameInput = page.getByLabel('Username');
  await expect(usernameInput).toBeVisible();

  // Use a more specific selector for the password input
  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await expect(passwordInput).toBeVisible();

  const testUsername = 'testuser';
  // Fill in username and password
  await usernameInput.fill(testUsername);
  await passwordInput.fill('SecurePassword123');

  // Click final sign up button
  await page.locator('#form-button').click();

  // Sign out the user
  await page.getByTestId('avatar-menu-trigger').click();
  await page.getByRole('menuitem', { name: /sign out/i }).click();

  // Verify redirection to sign in page
  await expect(page).toHaveURL('/signin');

  await page.goto('/signin');

  // Fill in credentials
  await page.getByLabel('Email or Username').fill('e2e@test.com');
  // Use a more specific selector for password input
  await page.getByRole('textbox', { name: 'Password' }).fill('SecurePassword123');

  // Click sign in button
  await page.locator('#form-button').click();

  // Verify redirection to home page
  await expect(page).toHaveURL('/');
});

test('Sign in with token flow', async ({ page }) => {
  await page.goto('/signin');

  // Fill in email
  await page.getByLabel('Email or Username').fill('e2e@test.com');

  // Click token sign in button
  await page.getByRole('button', { name: 'Sign in with token' }).click();

  // Find all input fields within the OTP component
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  // Alternative approach: type the OTP as a single action
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Click verify button
  await page.getByRole('button', { name: 'Verify' }).click();

  // Verify redirection to home page
  await expect(page).toHaveURL('/');
});

test('Token resend functionality', async ({ page }) => {
  test.setTimeout(40000);
  await page.goto('/signin');

  // Fill in email
  await page.getByLabel('Email or Username').fill('e2e@test.com');

  // Click token sign in button
  await page.getByRole('button', { name: 'Sign in with token' }).click();

  // Wait for verification step to appear
  await page.waitForTimeout(1000); // Give time for UI to update

  // Try a different selector for the verification code input
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  await page.waitForTimeout(30000);
  // Wait for the resend timer to expire (in a real test, you might want to mock this)
  // For testing purposes, we'll just check if the resend button becomes enabled
  const resendButton = page.getByText('Resend');
  await expect(resendButton).toBeEnabled({ timeout: 10000 }); // Reduced timeout for testing

  // Click resend button
  await resendButton.click();

  // Verify the resend timer is reset
  await expect(resendButton).toBeDisabled();

  // Alternative approach: type the OTP as a single action
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Click verify button
  await page.getByRole('button', { name: 'Verify' }).click();

  // Verify redirection to home page
  await expect(page).toHaveURL('/');

  // Clean up: Delete the test account
  await deleteTestAccount(page);
});
