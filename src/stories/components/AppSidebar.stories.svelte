<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  const { Story } = defineMeta({
    title: 'Components/AppSidebar',
    component: AppSidebar,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default">
  <Sidebar.Provider>
    <AppSidebar />
  </Sidebar.Provider>
</Story>
