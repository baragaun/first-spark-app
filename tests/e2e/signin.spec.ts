import { expect, test } from '@playwright/test';

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
  await page.goto('/signin');

  // Fill in credentials
  await page.getByLabel('Email or Username').fill('e2e@test.com');
  // Use a more specific selector for password input
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');

  // Intercept the authentication request
  await page.route('**/api/auth/signin', async (route) => {
    // Mock successful authentication
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    });
  });

  // Click sign in button
  await page.locator('#form-button').click();

  // Wait for navigation to complete
  await page.waitForURL('/');
  // Verify redirection to home page
  await expect(page).toHaveURL('/');
});

test('Sign in with token flow', async ({ page }) => {
  await page.goto('/signin');

  // Fill in email
  await page.getByLabel('Email or Username').fill('e2e@test.com');

  // Intercept the token request when clicking "Sign in with token"
  await page.route('**/api/auth/signMeInWithToken', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        object: {
          actionProgress: { actionId: 'test-action-id' },
          run: true,
        },
      }),
    });
  });

  // Click token sign in button
  await page.getByRole('button', { name: 'Sign in with token' }).click();

  // Wait for verification step to appear
  // await page.waitForSelector('#verification-code');

  // Find all input fields within the OTP component
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  // Alternative approach: type the OTP as a single action
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Intercept the verification request
  await page.route('**/api/auth/verifyMultiStepActionToken', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    });
  });

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

  // Intercept the initial token request
  await page.route('**/api/auth/signMeInWithToken', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        object: {
          actionProgress: { actionId: 'test-action-id' },
          run: true,
        },
      }),
    });
  });

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

  // Intercept the resend token request
  await page.route('**/api/auth/sendMultiStepActionNotification', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    });
  });

  // Click resend button
  await resendButton.click();

  // Verify the resend timer is reset
  await expect(resendButton).toBeDisabled();
});
