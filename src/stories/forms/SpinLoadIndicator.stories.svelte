<script module>
  import SpinLoadIndicator from '$lib/components/forms/spin-load-indicator.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/Forms/SpinLoadIndicator',
    parameters: { layout: 'centered' },
  });
</script>

<Story name="Idle" args={{ isLoading: false, isSuccess: false }}>
  <SpinLoadIndicator isLoading={false} isSuccess={false} />
</Story>

<Story name="Loading" args={{ isLoading: true, isSuccess: false }}>
  <SpinLoadIndicator isLoading={true} isSuccess={false} />
</Story>

<Story name="Success" args={{ isLoading: false, isSuccess: true }}>
  <SpinLoadIndicator isLoading={false} isSuccess={true} />
</Story>
