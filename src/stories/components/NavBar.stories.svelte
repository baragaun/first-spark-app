<script module>
  import NavBar from '@/components/layout/nav-bar/nav-bar.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, expect, userEvent } from '@storybook/test';

  const { Story } = defineMeta({
    title: 'Components/NavBar',
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story
  name="Default"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for sidebar trigger
    const sidebarTrigger = canvas.getByRole('button', { name: /toggle sidebar/i });
    expect(sidebarTrigger).toBeInTheDocument();

    // Check for theme toggle button
    const themeToggleButton = canvas.getByRole('button', { name: /change theme/i });
    expect(themeToggleButton).toBeInTheDocument();

    // Check for language selection button
    const languageButton = canvas.getByRole('button', { name: /select language/i });
    expect(languageButton).toBeInTheDocument();

    // Check for sign in button when not authenticated
    const signInButton = canvas.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();

    // Check for sign up button when not authenticated
    const signUpButton = canvas.getByRole('button', { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
  }}
>
  <NavBar isAuthenticated={false} myUser={undefined} onSignOut={() => {}} />
</Story>

<Story
  name="Signed In"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for avatar menu when authenticated
    const avatarMenu = canvas.getByText('FS', { selector: 'span[data-avatar-fallback]' });
    expect(avatarMenu).toBeInTheDocument();

    // Simulate a click on the avatar menu to open the dropdown
    await userEvent.click(avatarMenu);
    const dropdownMenu = canvas.getByTestId('avatar-menu-trigger');
    expect(dropdownMenu).toBeVisible();
  }}
>
  <NavBar
    isAuthenticated={true}
    myUser={{
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
    }}
    onSignOut={() => {}}
  />
</Story>
