<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LanguageButton from '$lib/components/language-button.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  const { Story } = defineMeta({
    title: 'Components/LanguageButton',
    component: LanguageButton,
  });
</script>

<Story name="Default">
  <Sidebar.Provider>
    <LanguageButton />
  </Sidebar.Provider>
</Story>
