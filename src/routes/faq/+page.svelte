<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';
	import MetaTags from '$lib/components/shared/meta-tags.svelte';
	import type { FAQSection } from '$lib/types/faq';
	import { cn } from '$lib/utils';
	import { FAQ_SECTIONS } from '$lib/docs/faq-data';

	// Use runes for state management
	const initialFAQSections: FAQSection[] = $state(FAQ_SECTIONS);

	// Derived state for open questions count
	const openQuestions = $derived(
		initialFAQSections.flatMap((section) => section.items.filter((item) => item.isOpen)).length
	);

	// Function to toggle question state
	function handleQuestionToggle(sectionIndex: number, itemIndex: number): void {
		initialFAQSections[sectionIndex].items[itemIndex].isOpen =
			!initialFAQSections[sectionIndex].items[itemIndex].isOpen;
	}

	// Track FAQ interactions
	$effect(() => {
		if (typeof window !== 'undefined' && openQuestions > 0) {
			console.log(`FAQ sections open: ${openQuestions}`);
		}
	});
</script>

<MetaTags
	title="Frequently Asked Questions | First Spark"
	description="Find answers to common questions about using First Spark, including information for students and buddies."
	canonicalUrl="/faq"
/>

<section class="faq-container">
	<header class="faq-header">
		<h1>Frequently Asked Questions</h1>
		<p class="subtitle">Find answers to common questions about using First Spark</p>
		{#if openQuestions > 0}
			<p class="open-counter">
				{openQuestions} question{openQuestions === 1 ? '' : 's'} expanded
			</p>
		{/if}
	</header>

	<div class="faq-sections">
		{#each initialFAQSections as section, sectionIndex (section.title)}
			<article class="faq-section">
				<header>
					<h2>{section.title}</h2>
				</header>

				<div class="questions-list">
					{#each section.items as item, itemIndex (item.question)}
						<div class="question-item">
							<button
								type="button"
								onclick={() => handleQuestionToggle(sectionIndex, itemIndex)}
								class={cn('question-button', item.isOpen && 'active')}
								aria-expanded={item.isOpen}
								aria-controls="faq-answer-{sectionIndex}-{itemIndex}"
							>
								<h3>{item.question}</h3>
								<ChevronDown class={cn('chevron', item.isOpen && 'rotated')} aria-hidden="true" />
							</button>

							{#if item.isOpen}
								<div
									id="faq-answer-{sectionIndex}-{itemIndex}"
									class="answer"
									transition:slide={{ duration: 200 }}
									role="region"
									aria-labelledby="question-{sectionIndex}-{itemIndex}"
								>
									{item.answer}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</article>
		{/each}
	</div>
</section>

<style lang="postcss">
	.faq-container {
		@apply container mx-auto px-4 py-16;
	}

	.faq-header {
		@apply mb-16 text-center;
	}

	.faq-header h1 {
		@apply mb-6 text-5xl font-bold tracking-tight text-primary;
	}

	.subtitle {
		@apply mx-auto max-w-2xl text-xl text-muted-foreground;
	}

	.open-counter {
		@apply mt-2 text-sm text-muted-foreground;
	}

	.faq-sections {
		@apply mx-auto max-w-3xl space-y-12;
	}

	.faq-section {
		@apply rounded-xl border bg-card p-6 shadow-sm;
	}

	.faq-section header {
		@apply mb-6 rounded-lg bg-muted p-4;
	}

	.faq-section h2 {
		@apply text-2xl font-semibold text-primary;
	}

	.questions-list {
		@apply space-y-4;
	}

	.question-item {
		@apply overflow-hidden rounded-lg border bg-background;
	}

	.question-button {
		@apply flex w-full items-center justify-between p-6 transition-colors hover:bg-muted/50;
	}

	.question-button h3 {
		@apply text-left text-lg font-medium;
	}

	.chevron {
		@apply h-5 w-5 transform transition-transform duration-200;
	}

	.chevron.rotated {
		@apply rotate-180;
	}

	.answer {
		@apply p-6 pt-0 text-muted-foreground;
	}

	/* Focus styles */
	.question-button:focus-visible {
		@apply outline-none ring-2 ring-ring ring-offset-2;
	}

	/* Active state */
	.question-button.active {
		@apply bg-muted;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.faq-header h1 {
			@apply text-4xl;
		}

		.subtitle {
			@apply text-lg;
		}

		.question-button {
			@apply p-4;
		}

		.question-button h3 {
			@apply text-base;
		}
	}
</style>
