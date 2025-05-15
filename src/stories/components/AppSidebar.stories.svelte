<script module>
  import AppSidebar from '@/components/layout/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/AppSidebar',
    component: AppSidebar,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">
  <Sidebar.Provider>
    <AppSidebar />
  </Sidebar.Provider>
</Story>
