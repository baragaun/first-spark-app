<script module>
  import ConnectionSonner from '$lib/components/connection-sonner.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { userEvent, within, expect } from '@storybook/test';

  const { Story } = defineMeta({
    title: 'Components/ConnectionSonner',
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story
  name="Offline"
  args={{ clientConnection: true }}
  play={async ({ canvasElement }) => {
    // Should show offline toast
    const canvas = within(canvasElement);
    expect(canvas.getByText(/offline/i)).toBeInTheDocument();
  }}
>
  <ConnectionSonner clientConnection={true} />
</Story>
