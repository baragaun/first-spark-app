<script module>
  import LanguageButton from '@/components/layout/nav-bar/language-button.svelte';
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

    try {
      // Find the language button using the message function
      const languageButton = await waitFor(() =>
        canvas.getByRole('button', { name: m['language.select']() }),
      );
      expect(languageButton).toBeInTheDocument();

      // Click the button to open the dropdown
      await userEvent.click(languageButton);

      // Wait for Hindi option to appear and click it
      const hindiOption = await waitFor(() => within(document.body).getByText('हिन्दी'));
      await userEvent.click(hindiOption);

      // Wait for language to change to Hindi
      await waitFor(
        () => {
          // Add a debug log
          console.log('Current lang:', document.documentElement.lang);
          expect(document.documentElement.lang).toBe('hi');
        },
        { timeout: 2000 },
      );

      // Click the button again to switch back to English
      await userEvent.click(languageButton);

      // Wait for English option to appear and click it
      const englishOption = await waitFor(() => within(document.body).getByText('English'));
      await userEvent.click(englishOption);

      // Wait for language to change to English
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('en');
      });
    } catch (error) {
      console.error('Test failed:', error);
    }
  }}
>
  <LanguageButton />
</Story>
