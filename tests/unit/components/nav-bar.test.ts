import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NavBar from '$lib/components/nav-bar.svelte';

describe('NavBar', () => {
	it('renders theme toggle button', async () => {
		render(NavBar);
		const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
		await expect(themeToggleButton).toBeVisible();
	});

	it('renders login and signup buttons when not authenticated', async () => {
		render(NavBar, { props: { isAuthenticated: false } });

		const signUpButton = screen.getByText('Sign Up');
		const logInButton = screen.getByText('Log In');

		await expect(logInButton).toBeVisible();
		await expect(signUpButton).toBeVisible();
	});

	it('renders UserNav component when authenticated', async () => {
		render(NavBar, { props: { isAuthenticated: true } });

		// Check for Toggle Sidebar
		const toggleSideBarButton = screen.getByRole('button', { name: 'Toggle Sidebar' });
		await expect(toggleSideBarButton).toBeVisible();

		// Verify login/signup buttons are not present when authenticated
		const signUpButton = screen.queryByText('Sign Up');
		const logInButton = screen.queryByText('Log In');

		expect(signUpButton).not.toBeInTheDocument();
		expect(logInButton).not.toBeInTheDocument();
	});
});
