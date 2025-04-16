<script module>
  import ThemeButton from '$lib/components/theme-button.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

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
