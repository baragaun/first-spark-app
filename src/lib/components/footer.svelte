<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LogoImage from '../../assets/icon.svg';

	// Use runes for state management
	const currentYear = $derived(new Date().getFullYear());
</script>

<footer class="border-t bg-background">
	<div class="container mx-auto px-4 py-4">
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
			<!-- Logo and Copyright -->
			<div class="flex flex-col items-center gap-2 lg:flex-row lg:items-center lg:gap-4">
				<a href="/" class="flex items-center gap-2" aria-label="Go to homepage">
					<img src={LogoImage} alt="First Spark Logo" class="h-8 w-8" width="32" height="32" />
					<span class="font-lexend text-xl font-bold text-primary whitespace-nowrap">First Spark</span>
				</a>
				<p class="text-sm text-center text-muted-foreground lg:text-left">
					© {currentYear} First Spark. All rights reserved.
				</p>
			</div>

			<!-- Navigation Links -->
			<nav
				class="flex flex-wrap items-center justify-center gap-4 text-sm"
				aria-label="Footer navigation"
			>
				<Button variant="link" href="/faq" class="text-muted-foreground hover:text-primary">
					FAQ
				</Button>
				<Button
					variant="link"
					href="/privacy-policy"
					class="text-muted-foreground hover:text-primary"
				>
					Privacy Policy
				</Button>
				<Button
					variant="link"
					href="/terms-of-service"
					class="text-muted-foreground hover:text-primary"
				>
					Terms of Service
				</Button>
			</nav>
		</div>
	</div>
</footer>

