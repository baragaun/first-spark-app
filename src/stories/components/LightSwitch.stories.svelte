<script module>
  import LightSwitch from '$lib/components/layout/nav-bar/light-switch.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, userEvent, expect, waitFor } from '@storybook/test';
  import { resetMode, userPrefersMode } from 'mode-watcher';
  import { get } from 'svelte/store';
  import { m } from '$lib/paraglide/messages.js';

  const { Story } = defineMeta({
    title: 'Components/Light Switch',
    parameters: {
      layout: 'centered',
    },
    argTypes: {
      iconButton: {
        control: 'boolean',
        description: 'Whether to show only the icon or include text',
        defaultValue: true,
      },
    },
  });
</script>

<Story
  name="Default"
  play={async ({ canvasElement }) => {
    // Always start with a clean mode state
    resetMode();

    const canvas = within(canvasElement);

    // Find the light switch button
    const switchButton = canvas.getByRole('button', { name: m['light_switch.tooltip']() });
    expect(switchButton).toBeInTheDocument();

    // Click the button to open the dropdown
    await userEvent.click(switchButton);

    // Wait for dropdown content to appear and find the Dark option
    await waitFor(async () => {
      const darkOption = await within(document.body).findByText('Dark');
      expect(darkOption).toBeVisible();
      await userEvent.click(darkOption);
    });
    // Check if dark mode is applied using mode-watcher
    await waitFor(
      () => {
        expect(get(userPrefersMode)).toBe('dark');
      },
      { timeout: 1000 },
    );

    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Open dropdown again
    await userEvent.click(switchButton);

    // Find and click the Light option
    await waitFor(async () => {
      const lightOption = await within(document.body).findByText('Light');
      expect(lightOption).toBeVisible();
      await userEvent.click(lightOption);
    });
    // Check if light mode is applied using mode-watcher
    await waitFor(
      () => {
        expect(get(userPrefersMode)).toBe('light');
      },
      { timeout: 1000 },
    );

    // Optionally reset mode at the end
    resetMode();
  }}
>
  <LightSwitch />
</Story>
