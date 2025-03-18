import NavBar, { authStore } from '$lib/components/nav-bar.svelte';
import { render, screen } from '@testing-library/svelte';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { changeLocale } from '../setup/i18n-setup';

describe('NavBar', () => {
  beforeEach(() => {
    authStore.set({ isAuthenticated: false });
  });

  it('renders login and signup buttons in English', () => {
    changeLocale('en');
    render(NavBar);

    expect(screen.getByText(get(_)('nav.auth.log_in'))).toBeInTheDocument();
    expect(screen.getByText(get(_)('nav.auth.sign_up'))).toBeInTheDocument();
  });

  it('renders login and signup buttons in German', () => {
    changeLocale('de');
    render(NavBar);

    // Will show "Anmelden" and "Registrieren"
    expect(screen.getByText(get(_)('nav.auth.log_in'))).toBeInTheDocument();
    expect(screen.getByText(get(_)('nav.auth.sign_up'))).toBeInTheDocument();
  });

  it('renders login and signup buttons in Hindi', () => {
    changeLocale('hi');
    render(NavBar);

    // Will show "लॉग इन" and "साइन अप"
    expect(screen.getByText(get(_)('nav.auth.log_in'))).toBeInTheDocument();
    expect(screen.getByText(get(_)('nav.auth.sign_up'))).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(NavBar);
    const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggleButton).toBeVisible();
  });

  it('hides auth buttons when authenticated', async () => {
    changeLocale('en');
    // Set authenticated state
    localStorage.setItem('authToken', 'your-auth-token');
    authStore.set({ isAuthenticated: true });
    render(NavBar);

    // Verify login/signup buttons are not present when authenticated
    const signUpButton = screen.queryByText(get(_)('nav.auth.sign_up'));
    const logInButton = screen.queryByText(get(_)('nav.auth.log_in'));

    expect(signUpButton).not.toBeInTheDocument();
    expect(logInButton).not.toBeInTheDocument();
  });
});
