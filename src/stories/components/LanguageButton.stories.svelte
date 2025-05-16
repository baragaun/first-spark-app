<script module>
  import LanguageButton from '$lib/components/layout/nav-bar/language-button.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, userEvent, expect, waitFor } from '@storybook/test';
  import { m } from '$lib/paraglide/messages.js';

  const { Story } = defineMeta({
    title: 'Components/LanguageButton',
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story
  name="Default"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the language button using the message function
    const languageButton = await waitFor(() =>
      canvas.getByRole('button', { name: m['language_button.tooltip']() }),
    );
    expect(languageButton).toBeInTheDocument();

    // Click the button to open the dropdown
    await userEvent.click(languageButton);

    // Wait for options to appear
    await waitFor(() => {
      expect(within(document.body).getByText('English')).toBeInTheDocument();
      expect(within(document.body).getByText('हिन्दी')).toBeInTheDocument();
      expect(within(document.body).getByText('Deutsch')).toBeInTheDocument();
    });
  }}
>
  <LanguageButton />
</Story>
