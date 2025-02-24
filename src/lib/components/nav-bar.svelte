<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Moon, Sun, Languages, Menu } from 'lucide-svelte';
	import UserNav from './user-nav.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { onMount } from 'svelte';

	// Add isAuthenticated state (you'll replace this with your actual auth logic later)
	let isAuthenticated = false;

	// Theme state management
	let isDarkMode = false;

	// Initialize theme based on system preference or stored value
	onMount(() => {
		// Check if theme is stored in localStorage
		const storedTheme = localStorage.getItem('theme');
		if (
			storedTheme === 'dark' ||
			(!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			isDarkMode = true;
			document.documentElement.classList.add('dark');
		}
	});

	const toggleTheme = () => {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
	};

	// Mobile menu state
	let isMobileMenuOpen = false;
</script>

<nav
	class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="flex h-16 items-center px-4">
		<!-- Sidebar Trigger (Both Mobile and Desktop) -->
		<div class="flex-none">
			<Sidebar.Trigger />
		</div>

		<!-- Logo and App Name (Mobile Only) -->
		<div class="flex flex-1 justify-center md:justify-start">
			<a href="/" class="flex items-center gap-2 transition-colors hover:opacity-90 md:hidden">
				<img src="/fs-logo.svg" alt="App Logo" class="h-8 w-8" />
				<span class="font-lexend text-xl font-bold text-primary">First Spark</span>
			</a>
		</div>

		<!-- Right side items -->
		<div class="flex flex-none items-center gap-4">
			<!-- Theme Toggle (Desktop Only) -->
			<Button
				variant="ghost"
				size="icon"
				onclick={toggleTheme}
				class="hidden text-muted-foreground hover:text-foreground md:flex"
				aria-label="Toggle theme"
			>
				{#if isDarkMode}
					<Sun class="h-5 w-5 transition-all" />
				{:else}
					<Moon class="h-5 w-5 transition-all" />
				{/if}
			</Button>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:items-center md:gap-4">
				<!-- Language Switcher -->
				<Button variant="ghost" size="icon" class="text-muted-foreground hover:text-foreground">
					<Languages class="h-5 w-5" />
				</Button>

				{#if isAuthenticated}
					<UserNav />
				{:else}
					<div class="flex items-center gap-2">
						<Button
							variant="ghost"
							href="/signin"
							class="font-lexend text-muted-foreground hover:text-foreground"
						>
							Log In
						</Button>
						<Button variant="default" href="/signup" class="font-lexend shadow-sm hover:shadow-md">
							Sign Up
						</Button>
					</div>
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<div class="flex md:hidden">
				<Button
					variant="ghost"
					size="icon"
					onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
					class="text-muted-foreground hover:text-foreground"
				>
					<Menu class="h-5 w-5" />
					<span class="sr-only">Open Menu</span>
				</Button>
				{#if isAuthenticated}
					<UserNav />
				{/if}
			</div>
		</div>
	</div>
</nav>

<!-- Mobile Menu Sheet -->
<Sheet.Root bind:open={isMobileMenuOpen}>
	<Sheet.Content side="right" class="w-[300px]">
		<div class="flex flex-col gap-4 p-6">
			<h2 class="font-lexend text-lg font-semibold">Menu</h2>

			<div class="flex flex-col gap-4">
				<!-- Mobile Menu Items -->
				<div class="flex flex-col gap-2">
					<!-- Theme Toggle -->
					<Button
						variant="ghost"
						onclick={toggleTheme}
						class="font-lexend w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
					>
						{#if isDarkMode}
							<Sun class="h-5 w-5" />
							<span>Light Mode</span>
						{:else}
							<Moon class="h-5 w-5" />
							<span>Dark Mode</span>
						{/if}
					</Button>

					<!-- Language Selection -->
					<Button
						variant="ghost"
						class="font-lexend w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
					>
						<Languages class="h-5 w-5" />
						<span>Change Language</span>
					</Button>

					<!-- Auth Buttons -->
					{#if isAuthenticated}
						<Button
							variant="destructive"
							href="/signout"
							class="font-lexend w-full justify-start text-muted-foreground hover:text-foreground"
							onclick={() => (isMobileMenuOpen = false)}
						>
							Sign Out
						</Button>
					{:else}
						<Button
							variant="secondary"
							href="/signin"
							class="font-lexend w-full justify-start text-muted-foreground hover:text-foreground"
							onclick={() => (isMobileMenuOpen = false)}
						>
							Log In
						</Button>
						<Button
							variant="default"
							href="/signup"
							class="font-lexend w-full justify-start shadow-sm hover:shadow-md"
							onclick={() => (isMobileMenuOpen = false)}
						>
							Sign Up
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
