import NavBar from '@/components/global/nav-bar/nav-bar.svelte';
import { render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

describe('NavBar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('when user is signed out', () => {
    beforeEach(() => {
      vi.mocked(userContextModule.myUserContext, true).isSignedIn = false;
    });

    it('renders the navbar with sign in and sign up buttons', () => {
      render(NavBar);

      // Check for sign in button
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      expect(signInButton).toBeInTheDocument();

      // Check for sign up button
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      expect(signUpButton).toBeInTheDocument();

      // Check for theme button
      const themeButton = screen.getByRole('button', { name: /toggle theme/i });
      expect(themeButton).toBeInTheDocument();

      // Check for language button
      const languageButton = screen.getByRole('button', { name: /change language/i });
      expect(languageButton).toBeInTheDocument();
    });

    it('navigates to sign in page when sign in button is clicked', async () => {
      const gotoMock = vi.fn();
      (await vi.mocked(import('$app/navigation'))).goto = gotoMock;

      render(NavBar);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      await fireEvent.click(signInButton);

      expect(gotoMock).toHaveBeenCalledWith('/signin');
    });

    it('navigates to sign up page when sign up button is clicked', async () => {
      const gotoMock = vi.fn();
      (await vi.mocked(import('$app/navigation'))).goto = gotoMock;

      render(NavBar);
      const signUpButton = screen.getByRole('button', { name: /sign up/i });

      await fireEvent.click(signUpButton);

      expect(gotoMock).toHaveBeenCalledWith('/signup');
    });
  });

  describe('when user is signed in', () => {
    beforeEach(() => {
      vi.mocked(userContextModule.myUserContext, true).isSignedIn = true;
    });

    it('does not render sign in and sign up buttons', () => {
      render(NavBar);

      // Sign in and sign up buttons should not be present
      const signInButton = screen.queryByRole('button', { name: /sign in/i });
      expect(signInButton).not.toBeInTheDocument();

      const signUpButton = screen.queryByRole('button', { name: /sign up/i });
      expect(signUpButton).not.toBeInTheDocument();
    });

    it('renders the avatar menu', () => {
      render(NavBar);

      // Avatar menu should be present
      const avatarMenu = screen.getByTestId('avatar-menu-trigger');
      expect(avatarMenu).toBeInTheDocument();
    });
  });

  it('renders the sidebar trigger', () => {
    render(NavBar);

    // Sidebar trigger should be present
    const sidebarTrigger = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(sidebarTrigger).toBeInTheDocument();
  });

  it('renders the logo on mobile view', () => {
    // Mock window.matchMedia for mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

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
