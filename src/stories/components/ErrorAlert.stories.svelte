<script module>
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, expect, userEvent } from '@storybook/test';

  const { Story } = defineMeta({
    title: 'Components/ErrorAlert',
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Default" args={{ errorMessage: 'Something went wrong. Please try again.' }}>
  <ErrorAlert errorMessage="Something went wrong. Please try again." />
</Story>

<Story
  name="Test"
  args={{ errorMessage: 'Something went wrong. Please try again.' }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check for error title and message
    expect(canvas.getByText('Error')).toBeInTheDocument();
    expect(canvas.getByText('Something went wrong. Please try again.')).toBeInTheDocument();

    // Check for close button and simulate click
    const closeButton = canvas.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);

    // After closing, the error message should not be visible
    expect(canvas.queryByText('Something went wrong. Please try again.')).not.toBeInTheDocument();
  }}
>
  <ErrorAlert errorMessage="Something went wrong. Please try again." />
</Story>
