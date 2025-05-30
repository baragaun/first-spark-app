import NavBar from '@/components/layout/nav-bar/nav-bar.svelte';
import { m } from '@/paraglide/messages.js';
import type { MyUser } from '@baragaun/bg-node-client';
import { render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('NavBar', () => {
  const createMockUserContext = (isSignedIn = false) => ({isSignedIn});

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
    const mockContext = createMockUserContext(false);
    render(NavBar, {
      context: new Map([['myUserContext', mockContext]])
    });
    const themeToggleButton = screen.getByLabelText(m['light_switch.tooltip']());
    expect(themeToggleButton).toBeVisible();
  });

  it('renders language selection button', async () => {
    const mockContext = createMockUserContext(false);
    render(NavBar, {
      context: new Map([['myUserContext', mockContext]])
    });
    const languageButton = screen.getByLabelText(m['language_button.tooltip']());
    expect(languageButton).toBeVisible();
  });

  it('renders sign in button when not authenticated', async () => {
    const mockContext = createMockUserContext(false);
    render(NavBar, {
      context: new Map([['myUserContext', mockContext]])
    });
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeVisible();
  });

  it('renders sign up button when not authenticated', async () => {
    const mockContext = createMockUserContext(false);
    render(NavBar, {
      context: new Map([['myUserContext', mockContext]])
    });
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    expect(signUpButton).toBeVisible();
  });

  it('does not render sign in/up buttons when authenticated', async () => {
    const mockContext = createMockUserContext(true);
    render(NavBar, {
      context: new Map([['myUserContext', mockContext]])
    });
    
    const signInButton = screen.queryByRole('button', { name: /sign in/i });
    const signUpButton = screen.queryByRole('button', { name: /sign up/i });
    
    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });
});
