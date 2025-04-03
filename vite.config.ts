import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['url', 'cookie', 'baseLocale'],
    }),
    sveltekit(),
    svelteTesting(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/*.{test,spec}.{js,ts,svelte}'],
    setupFiles: 'tests/setup.ts',
  },
});
