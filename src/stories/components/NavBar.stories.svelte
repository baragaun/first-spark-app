<script module>
  import NavBar from '$lib/components/layout/nav-bar/nav-bar.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, expect, userEvent } from '@storybook/test';
  import { m } from '$lib/paraglide/messages';

  const { Story } = defineMeta({
    title: 'Components/NavBar',
    component: NavBar,
    argTypes: {
      isAuthenticated: {
        control: 'boolean',
        defaultValue: false,
        description: 'Whether the user is authenticated',
      },
    },
    parameters: {
      layout: 'fullscreen',
    },
  });

  const mockUser = {
    id: '1234567890',
    email: 'test@example.com',
    userHandle: 'testuser',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEmailVerified: false,
    isPhoneNumberVerified: false,
    spokenLanguagesTextIds: [],
    roles: [],
    trustLevel: 0,
  };
</script>

<!-- <Meta /> -->

<Story
  name="Default"
  args={{
    isAuthenticated: false,
    myUser: mockUser,
    onSignOut: () => {},
  }}
  play={async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Common elements test
    // Check for sidebar trigger
    const sidebarTrigger = canvas.getByRole('button', { name: /toggle sidebar/i });
    expect(sidebarTrigger).toBeInTheDocument();

    // Check for theme toggle button
    const themeToggleButton = canvas.getByRole('button', { name: m['light_switch.tooltip']() });
    expect(themeToggleButton).toBeInTheDocument();

    // Check for language selection button
    const languageButton = canvas.getByRole('button', { name: m['language_button.tooltip']() });
    expect(languageButton).toBeInTheDocument();

    if (args.isAuthenticated) {
      // Authenticated state tests
      try {
        // Check for avatar menu when authenticated
        const avatarMenu = canvas.getByText('FS', { selector: 'span[data-avatar-fallback]' });
        expect(avatarMenu).toBeInTheDocument();

        // Simulate a click on the avatar menu to open the dropdown
        await userEvent.click(avatarMenu);
        const dropdownMenu = canvas.getByTestId('avatar-menu-trigger');
        expect(dropdownMenu).toBeVisible();
      } catch (error) {
        console.error('Authentication test failed:', error);
        throw error;
      }
    } else {
      // Unauthenticated state tests
      try {
        // Check for sign in button when not authenticated
        const signInButton = canvas.getByRole('button', { name: m['nav.auth.sign_in']() });
        expect(signInButton).toBeInTheDocument();

        // Check for sign up button when not authenticated
        const signUpButton = canvas.getByRole('button', { name: m['signup.title']() });
        expect(signUpButton).toBeInTheDocument();
      } catch (error) {
        console.error('Unauthentication test failed:', error);
        throw error;
      }
    }
  }}
>
  <!-- <NavBar 
    isAuthenticated={isAuthenticated} 
    myUser={args.isAuthenticated ? mockUser : undefined} 
    onSignOut={() => {}} 
  /> -->
</Story>
