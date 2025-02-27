<script lang="ts">
  import MetaTags from '$lib/components/shared/meta-tags.svelte';

  // Use runes for state management
  const lastUpdated = $state(
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  );

  // Effect for tracking page views
  $effect(() => {
    if (typeof window !== 'undefined') {
      console.log(`Terms of Service viewed at ${new Date().toISOString()}`);
    }
  });
</script>

<MetaTags
  title="Terms of Service | First Spark"
  description="Read our Terms of Service to understand the rules and guidelines for using First Spark's services."
  canonicalUrl="/terms-of-service"
/>

<div class="grid flex-1 place-items-center">
  <div class="flex flex-col items-center px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Terms of Service</h1>
    <p class="mt-4 text-muted-foreground">Last updated: {lastUpdated}</p>
  </div>
</div>
