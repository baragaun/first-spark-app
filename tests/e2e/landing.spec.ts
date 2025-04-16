import { expect, test } from '@playwright/test';

test('Landing page has welcome text, Get Started Button', async ({ page }) => {
  await page.goto('/'); // Navigate to home page

  // Check for the welcome text
  const welcomeText = page.getByText('Welcome to First Spark');
  await expect(welcomeText).toBeVisible();

  // Verify the subtext is also present
  const subtextElement = page.getByText('Connect, inspire, thrive!');
  await expect(subtextElement).toBeVisible();

  // Check for the Get Started button
  const getStartedButton = page.getByText('Get Started');
  await expect(getStartedButton).toBeVisible();
});

test('Landing page includes NavBar component, signup, login buttons', async ({ page }) => {
  await page.goto('/'); // Navigate to home page

  // Check for the navigation bar
  // Since the NavBar is in the layout, we can verify it by checking for elements that are part of the NavBar
  const navElement = page.getByRole('navigation').filter({ hasText: 'Sign In Sign Up' });
  await expect(navElement).toBeVisible();

  // We can also check for specific elements within the NavBar
  // Check if it contains a toggle theme button
  const themeToggleButton = navElement.getByRole('button', { name: 'Toggle theme' });
  await expect(themeToggleButton).toBeVisible();

  // Check if it contains a change language button
  const changeLanguageButton = navElement.getByLabel('Select Language');
  await expect(changeLanguageButton).toBeVisible();

  // Check if it contains a "Sign In" button
  const signInButton = navElement.getByRole('button', { name: 'Sign In' });
  await expect(signInButton).toBeVisible();

  // Check if it contains a "Sign Up" button
  const signUpButton = navElement.getByRole('button', { name: 'Sign Up' });
  await expect(signUpButton).toBeVisible();
});
