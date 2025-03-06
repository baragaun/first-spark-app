import NavBar, { authStore } from '$lib/components/nav-bar.svelte';
import { render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';

describe('NavBar', () => {
  beforeEach(() => {
    // Reset auth store before each test
    authStore.set({ isAuthenticated: false });
  });

  it('renders theme toggle button', async () => {
    render(NavBar);
    const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggleButton).toBeVisible();
  });

  it('renders login and signup buttons when not authenticated', async () => {
    authStore.set({ isAuthenticated: false });
    render(NavBar);

    const signUpButton = screen.getByText('Sign Up');
    const logInButton = screen.getByText('Log In');

    await expect(logInButton).toBeVisible();
    await expect(signUpButton).toBeVisible();
  });

  it('renders UserNav component when authenticated', async () => {
    // Set authenticated state
    localStorage.setItem('authToken', 'your-auth-token');
    authStore.set({ isAuthenticated: true });
    await render(NavBar);

    // Verify login/signup buttons are not present when authenticated
    const signUpButton = screen.queryByText('Sign Up');
    const logInButton = screen.queryByText('Log In');

    //await expect(logInButton).toBeVisible();
    await expect(signUpButton).not.toBeInTheDocument();
    await expect(logInButton).not.toBeInTheDocument();
  });
});
