import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run dev', // Start the SvelteKit dev server
    port: 5173, // Ensure this matches your app's port
    reuseExistingServer: !process.env.CI,
  },
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173', // Base URL of your Svelte app
    trace: 'on',
  },
  projects: [
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
  ],
});
