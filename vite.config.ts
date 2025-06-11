import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['cookie', 'preferredLanguage', 'baseLocale'],
    }),
    sveltekit(),
    svelteTesting(),
  ],
  test: {
    name: 'unit',
    globals: true,
    environment: 'jsdom',
    exclude: ['tests/e2e/**/*', 'node_modules/**/*'],
    setupFiles: 'tests/setup.ts',
  },
  server: {
    host: true, // Allow external connections
    strictPort: true, // Ensure the port is not changed automatically
    open: false, // Prevent auto-opening in the browser
    allowedHosts: ['*'], // Allow all hosts (use cautiously in development)
  },
});
