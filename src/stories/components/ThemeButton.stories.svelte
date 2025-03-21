<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemeButton from '$lib/components/theme-button.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  const { Story } = defineMeta({
    title: 'Components/ThemeButton',
    component: ThemeButton,
  });
</script>

<Story name="Default">
  <Sidebar.Provider>
    <ThemeButton />
  </Sidebar.Provider>
</Story>
