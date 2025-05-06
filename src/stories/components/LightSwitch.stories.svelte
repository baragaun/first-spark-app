<script module>
  import LightSwitch from '@/components/light-switch.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/LightSwitch',
    component: LightSwitch,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Default">
  <LightSwitch />
</Story>

<Story name="With label">
  <LightSwitch iconButton={false} />
</Story>
