import { m } from '$lib/paraglide/messages.js';
import { expect, test } from '@playwright/test';

test('Landing page has welcome text, Get Started Button', async ({ page }) => {
  await page.goto('/'); // Navigate to home page

  // Check for the welcome text
  const welcomeText = page.getByText('Welcome to First Spark');
  await expect(welcomeText).toBeVisible();

  // Verify the subtext is also present - use a more specific selector
  const subtextElement = page
    .getByRole('paragraph')
    .filter({ hasText: 'Connect, inspire, thrive!' });
  await expect(subtextElement).toBeVisible();

  // Check for the Get Started button in the main content area
  const getStartedButton = page.getByRole('main').getByRole('link', { name: 'Get Started' });
  await expect(getStartedButton).toBeVisible();
});

test('Landing page includes NavBar component, signup, login buttons', async ({ page }) => {
  await page.goto('/'); // Navigate to home page

  // Check for the navigation bar
  // Since the NavBar is in the layout, we can verify it by checking for elements that are part of the NavBar
  const navElement = page.getByRole('navigation').filter({ hasText: 'Sign up' });
  await expect(navElement).toBeVisible();

  // We can also check for specific elements within the NavBar
  // Check if it contains a toggle theme button
  const themeToggleButton = navElement.getByLabel(m['light_switch.tooltip']());

  await expect(themeToggleButton).toBeVisible();

  // Check if it contains a change language button
  const changeLanguageButton = navElement.getByLabel(m['language_button.tooltip']());
  await expect(changeLanguageButton).toBeVisible();

  // Check if it contains a "Sign in" button
  const signInButton = navElement.getByLabel(m['nav.auth.sign_in']());
  await expect(signInButton).toBeVisible();

  // Check if it contains a "Sign up" button
  const signUpButton = navElement.getByRole('button', { name: 'Sign up' });
  await expect(signUpButton).toBeVisible();
});
