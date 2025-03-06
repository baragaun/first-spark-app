<script lang="ts">
  import { slide } from 'svelte/transition';
  import { ChevronDown } from 'lucide-svelte';
  import MetaTags from '$lib/components/shared/meta-tags.svelte';
  import type { FAQSection } from '$lib/types/faq';
  import { cn } from '$lib/utils';
  import { FAQ_SECTIONS } from '$lib/docs/faq-data';

  const initialFAQSections: FAQSection[] = $state(FAQ_SECTIONS);

  function getOpenQuestionsCount() {
    return initialFAQSections.flatMap((section) => section.items.filter((item) => item.isOpen))
      .length;
  }

  function handleQuestionToggle(sectionIndex: number, itemIndex: number): void {
    initialFAQSections[sectionIndex].items[itemIndex].isOpen =
      !initialFAQSections[sectionIndex].items[itemIndex].isOpen;
  }

  $effect(() => {
    if (typeof window !== 'undefined' && getOpenQuestionsCount() > 0) {
      console.log(`FAQ sections open: ${getOpenQuestionsCount()}`);
    }
  });
</script>

<MetaTags
  title="Frequently Asked Questions | First Spark"
  description="Find answers to common questions about using First Spark, including information for students and buddies."
  canonicalUrl="/faq"
/>

<section class="container mx-auto px-4 py-16">
  <header class="mb-16 text-center">
    <h1 class="mb-6 text-5xl font-bold tracking-tight text-primary sm:text-5xl">
      Frequently Asked Questions
    </h1>
    <p class="mx-auto max-w-2xl text-xl text-muted-foreground">
      Find answers to common questions about using First Spark
    </p>
    {#if getOpenQuestionsCount() > 0}
      <p class="mt-2 text-sm text-muted-foreground">
        {getOpenQuestionsCount()} question{getOpenQuestionsCount() === 1 ? '' : 's'} expanded
      </p>
    {/if}
  </header>

  <div class="mx-auto max-w-3xl space-y-12">
    {#each initialFAQSections as section, sectionIndex (section.title)}
      <article class="rounded-xl border bg-card p-6 shadow-sm">
        <header class="mb-6 rounded-lg bg-muted p-4">
          <h2 class="text-2xl font-semibold text-primary">{section.title}</h2>
        </header>

        <div class="space-y-4">
          {#each section.items as item, itemIndex (item.question)}
            <div class="overflow-hidden rounded-lg border bg-background">
              <button
                type="button"
                onclick={() => handleQuestionToggle(sectionIndex, itemIndex)}
                class={cn(
                  'flex w-full items-center justify-between p-6 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  item.isOpen && 'bg-muted',
                )}
                aria-expanded={item.isOpen}
                aria-controls="faq-answer-{sectionIndex}-{itemIndex}"
              >
                <h3 class="text-left text-lg font-medium sm:text-base">{item.question}</h3>
                <ChevronDown
                  class={cn(
                    'h-5 w-5 transform transition-transform duration-200',
                    item.isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>

              {#if item.isOpen}
                <div
                  id="faq-answer-{sectionIndex}-{itemIndex}"
                  class="p-6 pt-0 text-muted-foreground"
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
