import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte({ hot: false })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup.ts'],
    include: ['**/*.test.{js,ts}'],
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '$app/navigation': path.resolve(__dirname, '../mocks/app-navigation.ts'),
      '$app/stores': path.resolve(__dirname, '../mocks/app-stores.ts'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '$app/navigation': path.resolve(__dirname, '../mocks/app-navigation.ts'),
      '$app/stores': path.resolve(__dirname, '../mocks/app-stores.ts'),
    },
  },
});
