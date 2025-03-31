<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemeButton from '$lib/components/theme-button.svelte';

  const { Story } = defineMeta({
    title: 'Components/ThemeButton',
    component: ThemeButton,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Default">
  <ThemeButton />
</Story>

<Story name="With label">
  <ThemeButton iconButton={false} />
</Story>
