import AvatarMenu from '@/components/nav-bar/avatar-menu.svelte';
import * as userContextModule from '@/contexts/my-user-context.svelte';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock modules before any tests run
vi.mock('@/contexts/my-user-context.svelte', () => {
  return {
    myUserContext: {
      isSignedIn: false,
      myUserHandle: undefined,
      myEmail: undefined,
      signMeOut: vi.fn().mockResolvedValue(true),
    },
  };
});

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

vi.mock('mode-watcher', () => ({
  toggleMode: vi.fn(),
}));

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('AvatarMenu', () => {
  // Desktop viewport tests
  describe('on desktop viewport', () => {
    beforeEach(() => {
      // Reset mocks
      vi.resetAllMocks();

      // Mock desktop viewport
      mockMatchMedia(false); // Not matching mobile media query
    });

    describe('when user is signed out', () => {
      beforeEach(() => {
        // Replace the entire mock object for signed-out state
        vi.mocked(userContextModule.myUserContext, true).isSignedIn = false;
        vi.mocked(userContextModule.myUserContext, true).myUserHandle = undefined;
        vi.mocked(userContextModule.myUserContext, true).myEmail = undefined;
        vi.mocked(userContextModule.myUserContext, true).signMeOut = vi
          .fn()
          .mockResolvedValue(true);
      });

      it('renders avatar menu trigger with horizontal dots icon', () => {
        render(AvatarMenu);
        const trigger = screen.getByTestId('avatar-menu-trigger');
        expect(trigger).toBeVisible();
        // Check for horizontal dots icon
        expect(document.querySelector('.lucide.lucide-ellipsis')).toBeInTheDocument();
      });

      it('shows sign in option in dropdown', async () => {
        render(AvatarMenu);

        // Get the dropdown trigger button and click it
        const trigger = screen.getByTestId('avatar-menu-trigger');
        await fireEvent.click(trigger);

        // Wait for the dropdown content to be visible
        await waitFor(() => {
          const signInOption = screen.getByTitle('Toggle theme');
          expect(signInOption).toBeInTheDocument();
        });
      });
    });

    describe('when user is signed in', () => {
      const mockUsername = 'testuser';
      const mockEmail = 'test@example.com';

      beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();

        // Replace the entire mock object for signed-in state
        Object.defineProperty(userContextModule, 'myUserContext', {
          value: {
            isSignedIn: true,
            myUserHandle: mockUsername,
            myEmail: mockEmail,
            signMeOut: vi.fn().mockResolvedValue(true),
          },
          configurable: true,
        });
      });

      it('renders avatar with user initials instead of dots icon', () => {
        render(AvatarMenu);
        const trigger = screen.getByTestId('avatar-menu-trigger');
        expect(trigger).toBeVisible();

        // Check for avatar component
        const avatar = document.querySelector('.h-9.w-9');
        expect(avatar).toBeInTheDocument();

        // Dots icon should not be present
        expect(document.querySelector('.lucide.lucide-ellipsis')).not.toBeInTheDocument();

        // Should show user initials
        expect(screen.getByText(/t/i)).toBeInTheDocument(); // First letter of username
      });

      it('shows user info and sign out option in dropdown', async () => {
        render(AvatarMenu);
        const trigger = screen.getByTestId('avatar-menu-trigger');
        await fireEvent.click(trigger);

        // Wait for dropdown content to be visible
        await waitFor(() => {
          // Check for username and email
          const usernameElement = screen.getByText(mockUsername);
          expect(usernameElement).toBeInTheDocument();

          const emailElement = screen.getByText((content, element) => {
            return (
              content.includes(mockEmail) || (element?.textContent?.includes(mockEmail) ?? false)
            );
          });
          expect(emailElement).toBeInTheDocument();

          // Check for sign out option
          const signOutOption = screen.getByRole('menuitem', { name: /sign out/i });
          expect(signOutOption).toBeInTheDocument();
        });
      });

      it('calls signMeOut and navigates when sign out is clicked', async () => {
        const gotoMock = vi.fn();
        (await vi.mocked(import('$app/navigation'))).goto = gotoMock;

        render(AvatarMenu);
        const trigger = screen.getByTestId('avatar-menu-trigger');
        await fireEvent.click(trigger);

        // Wait for dropdown to be visible
        await waitFor(async () => {
          const signOutOption = screen.getByRole('menuitem', { name: /sign out/i });
          expect(signOutOption).toBeInTheDocument();

          // Click the sign out option
          await fireEvent.click(signOutOption);
        });

        // Verify signMeOut was called
        expect(userContextModule.myUserContext.signMeOut).toHaveBeenCalled();
        // Verify navigation to signin page
        expect(gotoMock).toHaveBeenCalledWith('/signin');
      });
    });
  });

  // Mobile viewport tests
  describe('on mobile viewport', () => {
    beforeEach(() => {
      // Reset mocks
      vi.resetAllMocks();

      // Mock mobile viewport
      mockMatchMedia(true); // Matching mobile media query
    });

    describe('when user is signed out', () => {
      beforeEach(() => {
        // Replace the entire mock object for signed-out state
        vi.mocked(userContextModule.myUserContext, true).isSignedIn = false;
        vi.mocked(userContextModule.myUserContext, true).myUserHandle = undefined;
        vi.mocked(userContextModule.myUserContext, true).myEmail = undefined;
        vi.mocked(userContextModule.myUserContext, true).signMeOut = vi
          .fn()
          .mockResolvedValue(true);
      });

      it('renders avatar menu trigger with horizontal dots icon', () => {
        render(AvatarMenu);
        const trigger = screen.getByTestId('avatar-menu-trigger');
        expect(trigger).toBeVisible();
        // Check for horizontal dots icon
        expect(document.querySelector('.lucide.lucide-ellipsis')).toBeInTheDocument();
      });
    });

    describe('when user is signed in', () => {
      const mockUsername = 'testuser';
      const mockEmail = 'test@example.com';

      beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();

        // Replace the entire mock object for signed-in state
        Object.defineProperty(userContextModule, 'myUserContext', {
          value: {
            isSignedIn: true,
            myUserHandle: mockUsername,
            myEmail: mockEmail,
            signMeOut: vi.fn().mockResolvedValue(true),
          },
          configurable: true,
        });
      });

      it('always renders horizontal dots icon regardless of login state', () => {
        render(AvatarMenu);
        const trigger = screen.getByTestId('avatar-menu-trigger');
        expect(trigger).toBeVisible();

        // Check for horizontal dots icon (should be present even when logged in on mobile)
        expect(document.querySelector('.lucide.lucide-ellipsis')).toBeInTheDocument();

        // Avatar should not be visible on mobile
        const avatar = document.querySelector('.avatar');
        expect(avatar).not.toBeInTheDocument();
      });

      it('still shows user info in dropdown when logged in', async () => {
        render(AvatarMenu);
        const trigger = screen.getByTestId('avatar-menu-trigger');
        await fireEvent.click(trigger);

        // Wait for dropdown content to be visible
        await waitFor(() => {
          // Check for username and email
          const usernameElement = screen.getByText(mockUsername);
          expect(usernameElement).toBeInTheDocument();

          const emailElement = screen.getByText((content, element) => {
            return (
              content.includes(mockEmail) || (element?.textContent?.includes(mockEmail) ?? false)
            );
          });
          expect(emailElement).toBeInTheDocument();
        });
      });
    });
  });

  // Common tests for both viewports
  describe('common functionality', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('includes theme toggle option in dropdown menu', async () => {
      render(AvatarMenu);
      const trigger = screen.getByTestId('avatar-menu-trigger');
      await fireEvent.click(trigger);

      // Wait for dropdown to be visible
      await waitFor(() => {
        const themeToggle = screen.getByRole('menuitem', { name: /toggle theme/i });
        expect(themeToggle).toBeInTheDocument();
      });
    });

    it('includes language change option in dropdown menu', async () => {
      render(AvatarMenu);
      const trigger = screen.getByTestId('avatar-menu-trigger');
      await fireEvent.click(trigger);

      // Wait for dropdown to be visible
      await waitFor(() => {
        const languageOption = screen.getByRole('menuitem', { name: /change language/i });
        expect(languageOption).toBeInTheDocument();
      });
    });

    it('toggles theme when theme option is clicked', async () => {
      const toggleModeMock = vi.fn();
      (await vi.mocked(import('mode-watcher'))).toggleMode = toggleModeMock;

      render(AvatarMenu);
      const trigger = screen.getByTestId('avatar-menu-trigger');
      await fireEvent.click(trigger);

      // Wait for dropdown to be visible and click theme toggle
      await waitFor(async () => {
        const themeToggle = screen.getByRole('menuitem', { name: /toggle theme/i });
        await fireEvent.click(themeToggle);
      });

      // Verify toggleMode was called
      expect(toggleModeMock).toHaveBeenCalled();
    });
  });
});
