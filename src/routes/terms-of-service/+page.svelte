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

		<div class="terms-content">
			{#each sections as section}
				<article class="terms-section">
					<h2>{section.title}</h2>
					<div class="section-content">
						<p>{section.content}</p>
						{#if section.listItems}
							{#if section.title === '2. Use License'}
								<p>Under this license, you may not:</p>
							{/if}
							<ul>
								{#each section.listItems as item}
									<li>{item}</li>
								{/each}
							</ul>
						{/if}
					</div>
				</article>
			{/each}
		</div>
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

	.terms-content {
		@apply space-y-12;
	}

	.terms-section {
		@apply rounded-xl border bg-card p-8 shadow-sm;
	}

	.terms-section h2 {
		@apply mb-4 text-2xl font-semibold text-primary;
	}

	.section-content {
		@apply text-foreground;
	}

	.section-content p {
		@apply mb-4 leading-7;
	}

	.section-content ul {
		@apply list-disc space-y-2 pl-6;
	}

	.section-content li {
		@apply leading-7;
	}
</style>
