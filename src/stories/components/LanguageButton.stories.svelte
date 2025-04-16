<script module>
  import LanguageButton from '$lib/components/language-button.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

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
