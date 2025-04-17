<script module>
  import * as Sidebar from '$lib/components/ui/sidebar/index';
  import NavBar from '@/components/nav-bar/nav-bar.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';

  const { Story } = defineMeta({
    title: 'Components/NavBar',
    component: NavBar,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Signed Out">
  <MockUserProvider signedIn={false}>
    <Sidebar.Provider>
      <NavBar />
    </Sidebar.Provider>
  </MockUserProvider>
</Story>

<Story name="Signed In">
  <MockUserProvider signedIn={true}>
    <Sidebar.Provider>
      <NavBar />
    </Sidebar.Provider>
  </MockUserProvider>
</Story>
