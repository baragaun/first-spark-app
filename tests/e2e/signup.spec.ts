import { expect, test } from '@playwright/test';
var testId = 0; // Increment this for each test to mail different email id's

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
  testId++;
  test.setTimeout(60000); // Increase timeout for this test
  await page.goto('/signup');

  // Step 1: Email submission
  await page.getByLabel('Email address').fill(`e2e-test${testId}@example.com`);

  // Intercept the sign up request
  await page.route('**/api/auth/signUpUser', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(true),
    });
  });

  // Intercept the email verification request
  await page.route('**/api/auth/verifyMyEmail', async (route) => {
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

  // Click sign up button
  await page.locator('#form-button').click();

  // Step 2: Verification code
  // Wait for the OTP input to appear
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  // Enter verification code
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Intercept the token verification request
  await page.route('**/api/auth/verifyMultiStepActionToken', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(true),
    });
  });

  // Intercept the username suggestion request
  await page.route('**/api/auth/findAvailableUserHandle', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify('testuser123'),
    });
  });

  // Click submit button
  await page.locator('#form-button').click();

  // Step 3: Username and password
  // Wait for username and password fields to appear
  const usernameInput = page.getByLabel('Username');
  await expect(usernameInput).toBeVisible();

  // Use a more specific selector for the password input
  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await expect(passwordInput).toBeVisible();

  // Fill in username and password
  await usernameInput.fill(`testuser${testId}`);
  await passwordInput.fill('SecurePassword123');

  // Intercept the user update request
  await page.route('**/api/auth/updateMyUser', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    });
  });

  // Click final sign up button
  await page.locator('#form-button').click();

  // Verify redirection to home page
  await expect(page).toHaveURL('/');
});

test('Sign up - email availability check', async ({ page }) => {
  testId++;
  await page.goto('/signup');

  // Intercept the availability check
  await page.route('**/api/auth/isUserIdentAvailable', async (route) => {
    const url = route.request().url();
    if (url.includes('e2e@test.com')) {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ isAvailable: false }),
      });
    } else {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ isAvailable: true }),
      });
    }
  });

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
  await page.getByLabel('Email address').fill('available@example.com');
  await page.waitForTimeout(500); // Wait for debounce

  // Verify button is enabled
  await expect(signUpButton).toBeEnabled();
});

test('Sign up - token resend functionality', async ({ page }) => {
  testId++;
  test.setTimeout(40000);
  await page.goto('/signup');

  // Fill in email
  await page.getByLabel('Email address').fill(`e2e-test${testId}@example.com`);

  // Intercept the sign up request
  await page.route('**/api/auth/signUpUser', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(true),
    });
  });

  // Intercept the email verification request
  await page.route('**/api/auth/verifyMyEmail', async (route) => {
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

  // Intercept the resend token request
  await page.route('**/api/auth/sendMultiStepActionNotification', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    });
  });

  // Click resend button
  await expect(resendButton).toBeEnabled();
  await resendButton.click();

  // Verify the resend timer is reset
  await expect(resendButton).toBeDisabled();
});

test('Sign up - username availability check', async ({ page }) => {
  testId++;
  // Navigate directly to step 3 by mocking the previous steps
  await page.goto('/signup');

  // Set up the page to be in step 3
  await page.evaluate(() => {
    // This simulates being at step 3 of the signup process
    window.localStorage.setItem('signup_step', '3');
  });

  // Refresh to apply the localStorage change
  await page.reload();

  // If the above doesn't work, we need to go through steps 1-2 first
  // (simplified version for this test)
  if (!(await page.getByLabel('Username').isVisible())) {
    // Go through steps 1-2 quickly (simplified)
    await test.step('Setup step 3', async () => {
      // Step 1
      await page.getByLabel('Email address').fill(`e2e-test${testId}@example.com`);
      await page.route('**/api/auth/signUpUser', async (route) => {
        await route.fulfill({ status: 200, body: JSON.stringify(true) });
      });
      await page.route('**/api/auth/verifyMyEmail', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            object: { actionProgress: { actionId: 'test-id' }, run: true },
          }),
        });
      });
      await page.locator('#form-button').click();

      // Step 2
      await page.route('**/api/auth/verifyMultiStepActionToken', async (route) => {
        await route.fulfill({ status: 200, body: JSON.stringify(true) });
      });
      await page.locator('#verification-code input').first().focus();
      await page.keyboard.type('666666');
      await page.locator('#form-button').click();
    });
  }

  // Now we should be at step 3
  // Intercept the availability check
  await page.route('**/api/auth/isUserIdentAvailable', async (route) => {
    const url = route.request().url();
    if (url.includes('unavailable')) {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ isAvailable: false }),
      });
    } else {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ isAvailable: true }),
      });
    }
  });

  // Test unavailable username
  await page.getByLabel('Username').fill('testuser2');
  await page.waitForTimeout(500); // Wait for debounce

  // Check for error message
  const errorMessage = page.getByText('This username is currently unavailable for use');
  await expect(errorMessage).toBeVisible();

  // Verify button is disabled
  const signUpButton = page.locator('#form-button');
  await expect(signUpButton).toBeDisabled();

  // Test available username
  await page.getByLabel('Username').clear();
  await page.getByLabel('Username').fill('available');
  await page.waitForTimeout(500); // Wait for debounce

  // Fill password field to enable the button
  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await passwordInput.fill('SecurePassword123');

  // Verify button is enabled
  await expect(signUpButton).toBeEnabled();
});
