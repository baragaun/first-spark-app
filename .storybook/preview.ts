import type { Preview } from '@storybook/svelte';
import { themes } from '@storybook/theming';
import '../src/app.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
    layout: 'fullscreen',
  },
};

export default preview;
