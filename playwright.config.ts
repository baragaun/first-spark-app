import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'VITE_E2E_TESTING=true pnpm run dev', // Set env var for E2E testing
    port: 5173, // Ensure this matches your app's port
    reuseExistingServer: !process.env.CI,
  },
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173', // Base URL of your Svelte app
    trace: 'on',
  },
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});
