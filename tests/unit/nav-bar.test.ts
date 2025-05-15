import NavBar from '@/components/layout/nav-bar/nav-bar.svelte';
import { render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

describe('NavBar', () => {
  // beforeEach(() => {});

  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    // Reset window dimensions after each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });

    // Reset any matchMedia mocks
    window.matchMedia = originalMatchMedia;
  });

  it('renders theme toggle button', async () => {
    render(NavBar);
    const themeToggleButton = screen.getByRole('button', { name: /change theme/i });
    expect(themeToggleButton).toBeVisible();
  });

  it('renders language selection button', async () => {
    render(NavBar);
    const languageButton = screen.getByRole('button', { name: /select language/i });
    expect(languageButton).toBeVisible();
  });

  it('renders sign in button when not authenticated', async () => {
    render(NavBar);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeVisible();
  });

  it('renders sign up button when not authenticated', async () => {
    render(NavBar);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    expect(signUpButton).toBeVisible();
  });
});
