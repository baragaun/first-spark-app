<script lang="ts">
  import MetaTags from '$components/shared/meta-tags.svelte';

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  $effect(() => {
    if (typeof window !== 'undefined') {
      console.log(`Privacy Policy viewed at ${new Date().toISOString()}`);
    }
  });
</script>

<MetaTags
  title="Privacy Policy | First Spark"
  description="Learn about how First Spark collects, uses, and protects your personal information."
  canonicalUrl="/privacy-policy"
/>

<div class="grid flex-1 place-items-center">
  <div class="flex flex-col items-center px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Privacy Policy</h1>
    <p class="mt-4 text-muted-foreground">Last updated: {lastUpdated}</p>
  </div>
</div>
