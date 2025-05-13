<script module>
  import * as Sidebar from '$lib/components/ui/sidebar/index';
  import NavBar from '@/components/global/nav-bar/nav-bar.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';
  import { within, expect, userEvent } from '@storybook/test';

  const { Story } = defineMeta({
    title: 'Components/NavBar',
    component: MockUserProvider,
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
  <MockUserProvider>
    <Sidebar.Provider>
      <NavBar />
    </Sidebar.Provider>
  </MockUserProvider>
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

    // // Debugging: Log the dropdown contents
    // console.log(dropdownMenu);

    // // Check for user information inside the dropdown
    // const userName = within(dropdownMenu).getByText('testuser');
    // expect(userName).toBeInTheDocument();

    // const userEmail = within(dropdownMenu).getByText('test@example.com');
    // expect(userEmail).toBeInTheDocument();

    // // Check for the "Settings" menu item
    // const settingsMenuItem = within(dropdownMenu).getByRole('menuitem', { name: /settings/i });
    // expect(settingsMenuItem).toBeInTheDocument();

    // // Check for the "Sign Out" menu item
    // const signOutMenuItem = within(dropdownMenu).getByRole('menuitem', { name: /sign out/i });
    // expect(signOutMenuItem).toBeInTheDocument();
  }}
>
  <MockUserProvider isSignedIn = {true} >
    <Sidebar.Provider>
      <NavBar />
    </Sidebar.Provider>
  </MockUserProvider>
</Story>