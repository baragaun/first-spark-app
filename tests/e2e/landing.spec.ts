import { test, expect } from '@playwright/test';

test('Landing page has welcome text, Get Started Button', async ({ page }) => {
  await page.goto('/'); // Navigate to home page
  
  // Check for the welcome text
  const welcomeText = page.getByText('Welcome to First Spark');
  await expect(welcomeText).toBeVisible();
  
  // Verify the subtext is also present
  const subtextElement = page.getByText('The future is changing rapidly as it never has before.');
  await expect(subtextElement).toBeVisible();

  // Check for the Get Started button
  const logInButton = page.getByRole('button', { name: 'Get Started' });
  await expect(logInButton).toBeVisible();
});

test('Landing page includes NavBar component, signup, login buttons', async ({ page }) => {
  await page.goto('/'); // Navigate to home page
  
  // Check for the navigation bar
  // Since the NavBar is in the layout, we can verify it by checking for elements that are part of the NavBar
  const navElement = page.locator('nav');
  await expect(navElement).toBeVisible();
  
  // We can also check for specific elements within the NavBar
  const themeToggleButton = page.getByRole('button', { name: /toggle theme/i });
  await expect(themeToggleButton).toBeVisible();

  // Check if it contains a Sign Up button
  const signUpButton = navElement.getByText('Sign Up');
  await expect(signUpButton).toBeVisible();

  // Check if it contains a Log In button
  const logInButton = navElement.getByText('Log In');
  await expect(logInButton).toBeVisible();
});
