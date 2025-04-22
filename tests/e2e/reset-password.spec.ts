import { expect, test } from '@playwright/test';

// test('Reset password page has correct UI elements', async ({ page }) => {
//   await page.goto('/reset-password');

//   // Check for the auth card with correct title
//   const authCard = page.getByRole('heading', { name: 'Reset your password' });
//   await expect(authCard).toBeVisible();

//   // Check for form inputs in step 1
//   const emailInput = page.getByLabel('Username or email');
//   await expect(emailInput).toBeVisible();

//   // Check for button
//   const resetButton = page.locator('#form-button');
//   await expect(resetButton).toBeVisible();
//   await expect(resetButton).toHaveText('Send me an email');
// });

test('Reset password flow - complete process', async ({ page }) => {
  await page.goto('/reset-password');

  // Step 1: Enter email and request reset
  await page.getByLabel('Username or email').fill('e2e-test@example.com');

  // Intercept the isUserIdentAvailable check
  await page.route('**/api/auth/isUserIdentAvailable', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ isAvailable: false }), // User exists
    });
  });

  // Intercept the reset password request
  await page.route('**/api/auth/resetMyPassword', async (route) => {
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

  // Click the reset button
  await page.locator('#form-button').click();

  // Step 2: Enter verification code
  // Wait for verification step to appear
  const otpInputs = page.locator('#verification-code');
  await expect(otpInputs.first()).toBeVisible();

  // Enter the OTP code
  await page.locator('#verification-code input').first().focus();
  await page.keyboard.type('666666');

  // Intercept the verification request
  await page.route('**/api/auth/verifyMultiStepActionToken', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(true),
    });
  });

  // Click verify button
  await page.locator('#form-button').click();

  // Step 3: Set new password
  // Wait for password input to appear
  const passwordInput = page.getByLabel('New password');
  await expect(passwordInput).toBeVisible();

  // Enter new password
  await passwordInput.fill('NewSecurePassword123');

  // Intercept the final verification with password update
  await page.route('**/api/auth/verifyMultiStepActionToken', async (route) => {
    const requestBody = JSON.parse((await route.request().postData()) || '{}');
    if (requestBody.password) {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(true),
      });
    } else {
      // Let the previous handler take care of it
      await route.fallback();
    }
  });

  // Intercept the sign in request that happens after password reset
  await page.route('**/api/auth/signin', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(true),
    });
  });

  // Click update password button
  await page.locator('#form-button').click();

  // Verify redirection to home page
  await expect(page).toHaveURL('/');
});

// test('Reset password - resend token functionality', async ({ page }) => {
//   test.setTimeout(40000);
//   await page.goto('/reset-password');

//   // Step 1: Enter email and request reset
//   await page.getByLabel('Username or email').fill('e2e@test.com');

//   // Intercept the isUserIdentAvailable check
//   await page.route('**/api/auth/isUserIdentAvailable', async route => {
//     await route.fulfill({
//       status: 200,
//       body: JSON.stringify({ isAvailable: false }) // User exists
//     });
//   });

//   // Intercept the reset password request
//   await page.route('**/api/auth/resetMyPassword', async route => {
//     await route.fulfill({
//       status: 200,
//       body: JSON.stringify({
//         object: {
//           actionProgress: { actionId: 'test-action-id' },
//           run: true
//         }
//       })
//     });
//   });

//   // Click the reset button
//   await page.locator('#form-button').click();

//   // Wait for verification step to appear
//   const otpInputs = page.locator('#verification-code');
//   await expect(otpInputs.first()).toBeVisible();

//   // Wait for the resend timer to expire
//   await page.waitForTimeout(30000);

//   // Verify resend button becomes enabled
//   const resendButton = page.getByText('Resend');
//   await expect(resendButton).toBeEnabled({ timeout: 10000 });

//   // Intercept the resend token request
//   await page.route('**/api/auth/sendMultiStepActionNotification', async route => {
//     await route.fulfill({
//       status: 200,
//       body: JSON.stringify(true)
//     });
//   });

//   // Click resend button
//   await resendButton.click();

//   // Verify the resend timer is reset
//   await expect(resendButton).toBeDisabled();
// });
