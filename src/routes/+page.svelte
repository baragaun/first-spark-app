<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  // const isAuthenticated = $derived(myUserContext.isSignedIn);
</script>

<div class="grid flex-1 place-items-center">
  <div class="flex flex-col items-center px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
      Welcome to First Spark
    </h1>

    <p class="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground">
      Connect, inspire, thrive!
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      {#if !myUserContext.isAuthenticated}
        <Button
          variant="default"
          size="lg"
          class="shadow-lg transition-all hover:scale-105 hover:shadow-primary/25 active:scale-100"
          href="/signup"
        >
          Get Started
        </Button>
      {/if}
    </div>
  </div>
</div>
