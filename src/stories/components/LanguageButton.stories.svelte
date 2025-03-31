<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LanguageButton from '$lib/components/language-button.svelte';

  const { Story } = defineMeta({
    title: 'Components/LanguageButton',
    component: LanguageButton,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Default">
  <LanguageButton />
</Story>
