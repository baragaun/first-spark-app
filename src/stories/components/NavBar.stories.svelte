<script module>
  import * as Sidebar from '$lib/components/ui/sidebar/index';
  import NavBar from '@/components/global/nav-bar/nav-bar.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';
  import { within, expect } from '@storybook/test';

  const { Story } = defineMeta({
    title: 'Components/NavBar',
    component: NavBar,
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
