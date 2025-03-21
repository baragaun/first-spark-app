<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Footer from '$lib/components/footer.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { fn } from '@storybook/test';

  const { Story } = defineMeta({
    title: 'Components/Footer',
    component: Footer,
  });
</script>

<Story name="Default">
  <Sidebar.Provider>
    <Footer />
  </Sidebar.Provider>
</Story>
