import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['tests/unit/*.{test,spec}.{js,ts,svelte}'],
		setupFiles: 'tests/setup.ts'
	}
});
