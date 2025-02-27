<script lang="ts">
	import MetaTags from '$lib/components/shared/meta-tags.svelte';
	import type { TermsSection } from '$lib/types/terms';
	import { TERMS_SECTIONS } from '$lib/types/terms';

	// Use runes for state management
	let lastUpdated = $state(
		new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);

	let sections = $state<TermsSection[]>(TERMS_SECTIONS);

	// Track page views
	$effect(() => {
		if (typeof window !== 'undefined') {
			console.log(`Terms of Service viewed at ${new Date().toISOString()}`);
		}
	});
</script>

<MetaTags
	title="Terms of Service | First Spark"
	description="Read our Terms of Service to understand the rules and guidelines for using First Spark's services."
	canonicalUrl="/terms"
/>

<section class="terms-container">
	<div class="terms-wrapper">
		<header class="terms-header">
			<h1>Terms of Service</h1>
			<p class="last-updated">Last updated: {lastUpdated}</p>
		</header>
	</div>
</section>

<style lang="postcss">
	.terms-container {
		@apply container mx-auto px-4 py-16;
	}

	.terms-wrapper {
		@apply mx-auto max-w-4xl;
	}

	.terms-header {
		@apply mb-12 text-center;
	}

	.terms-header h1 {
		@apply mb-6 text-5xl font-bold tracking-tight;
	}

	.last-updated {
		@apply text-muted-foreground;
	}
</style>
