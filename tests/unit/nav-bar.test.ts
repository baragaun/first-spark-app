import NavBar from '@/components/nav-bar/nav-bar.svelte';
import { render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';

describe('NavBar', () => {
  beforeEach(() => {
    // Reset auth store before each test
    // authStore.set({ isAuthenticated: false });
  });

  const signUpButton = screen.queryByText('Sign Up');
  const signInButton = screen.queryByText('Sign In');
  const signOutButton = screen.queryByText('Sign Out');

  it('renders theme toggle button', async () => {
    render(NavBar);
    const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggleButton).toBeVisible();
  });

  it('renders language selection button', async () => {
    render(NavBar);
    const languageButton = screen.getByRole('button', { name: /change language/i });
    expect(languageButton).toBeVisible();
  });

  it('renders signin button', async () => {
    // authStore.set({ isAuthenticated: false });
    render(NavBar);

    expect(signInButton).toBeVisible();
  });

  it('renders signup button', async () => {
    // authStore.set({ isAuthenticated: false });
    render(NavBar);

    expect(signUpButton).toBeVisible();
  });

  it('renders Sign Out button component when authenticated', async () => {
    localStorage.setItem('authToken', 'your-auth-token');
    // authStore.set({ isAuthenticated: true });
    render(NavBar);

    expect(signOutButton).toBeVisible();
  });
});
