import NavBar from '@/components/nav-bar/nav-bar.svelte';
import { render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { m } from '$lib/paraglide/messages';

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
    const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
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

  it('renders the avatarMenu when viewport is small and unauthenticated', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    window.matchMedia = (query) => ({
      matches: query.includes('max-width') && query.includes('768px'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));

    render(NavBar);
    const avatarMenuButton = screen.getByTestId('avatar-menu-trigger');
    expect(avatarMenuButton).toBeVisible();
  });
});
