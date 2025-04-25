import { expect, test } from '@playwright/test';
import { deleteTestAccount } from './utils/test-account';

test('Sign up page has correct UI elements', async ({ page }) => {
  await page.goto('/signup');

  // Check for the auth card with correct title
  const authCard = page.getByRole('heading', { name: 'Sign up' });
  await expect(authCard).toBeVisible();

  // Check for form inputs (first step)
  const emailInput = page.getByLabel('Email address');
  await expect(emailInput).toBeVisible();

  // Check for buttons
  const signUpButton = page.locator('#form-button');
  await expect(signUpButton).toBeVisible();
  await expect(signUpButton).toHaveText('Sign Up');

  // Check for sign in link
  const signInLink = page.getByRole('link', { name: 'Sign in' });
  await expect(signInLink).toBeVisible();
});

test('Sign up flow - complete registration', async ({ page }) => {
  test.setTimeout(60000); // Increase timeout for this test
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

  // Verify redirection to home page
  await expect(page).toHaveURL('/');

  // Clean up: Delete the test account
  await deleteTestAccount(page);
});

test('Sign up - email availability check', async ({ page }) => {
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
  // Sign out the user
  await page.getByTestId('avatar-menu-trigger').click();
  await page.getByRole('menuitem', { name: /sign out/i }).click();

  // Verify redirection to sign in page
  await expect(page).toHaveURL('/signin');

  await page.goto('/signup');

  // Test unavailable email
  await page.getByLabel('Email address').fill('e2e@test.com');
  await page.waitForTimeout(500); // Wait for debounce

  // Check for error message
  const errorMessage = page.getByText('This email is currently unavailable for use');
  await expect(errorMessage).toBeVisible();

  // Verify button is disabled
  const signUpButton = page.locator('#form-button');
  await expect(signUpButton).toBeDisabled();

  // Test available email
  await page.getByLabel('Email address').clear();
  await page.getByLabel('Email address').fill('available@test.com');
  await page.waitForTimeout(500); // Wait for debounce
  await expect(signUpButton).toBeEnabled();

  // Clean up: Delete the test account
  // First sign in again with the test account
  await page.goto('/signin');

  // Fill in username or email
  await page.getByLabel('Email or Username').fill('e2e@test.com');

  // Click token sign in button
  await page.getByRole('button', { name: 'Sign in with token' }).click();

  // Wait for the OTP input to appear
  const otpInput = page.locator('#verification-code');
  await expect(otpInput.first()).toBeVisible();

  // Enter verification code
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Click verify button
  await page.getByRole('button', { name: 'Verify' }).click();

  // Wait for successful sign-in
  await expect(page).toHaveURL('/');

  // Now delete the account
  await deleteTestAccount(page);
});

test('Sign up - token resend functionality', async ({ page }) => {
  test.setTimeout(40000);
  await page.goto('/signup');

  // Fill in email
  await page.getByLabel('Email address').fill('e2e@test.com');

  // Click sign up button
  await page.locator('#form-button').click();

  // Wait for verification step to appear
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  await page.waitForTimeout(30000);
  // Wait for the resend timer to expire (in a real test, you might want to mock this)
  // For testing purposes, we'll just check if the resend button becomes enabled

  const resendButton = page.getByText('Resend');
  await expect(resendButton).toBeEnabled({ timeout: 10000 }); // Reduced timeout for testing

  // Click resend button
  await expect(resendButton).toBeEnabled();
  await resendButton.click();

  // Verify the resend timer is reset
  await expect(resendButton).toBeDisabled();

  // Clean up: Delete the test account
  await deleteTestAccount(page);
});
