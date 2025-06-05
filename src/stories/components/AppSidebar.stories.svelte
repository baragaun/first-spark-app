<script module>
  import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, expect } from '@storybook/test';
  import { m } from '$lib/paraglide/messages';

  const { Story } = defineMeta({
    title: 'Components/AppSidebar',
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story
  name="Default"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for logo
    const logo = canvas.getByAltText('First Spark Logo');
    expect(logo).toBeInTheDocument();

    // Check for app name
    const appName = canvas.getByText('First Spark');
    expect(appName).toBeInTheDocument();

    // Check for home menu item
    const homeItem = canvas.getByRole('link', { name: new RegExp(m['sidebar.menu.home']()) });
    expect(homeItem).toBeInTheDocument();

    // Check for sign-in and sign-up buttons when not authenticated
    const getStartedButton = canvas.getByRole('link', { name: m['get_started']() });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton.getAttribute('href')).toBe('/signup');

    const signInButton = canvas.getByRole('link', { name: m['nav.auth.sign_in']() });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton.getAttribute('href')).toBe('/signin');

    // Check for connection status button
    const connectionButton = canvas.getByRole('button', {
      name: new RegExp(m['connection.online']()),
    });
    expect(connectionButton).toBeInTheDocument();
  }}
>
  <Sidebar.Provider>
    <AppSidebar />
  </Sidebar.Provider>
</Story>
