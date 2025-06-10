<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { m } from '$lib/paraglide/messages.js';
  import { MyUserContext } from '@/contexts/users/my-user-context.svelte';
  import { getContext } from 'svelte';

  const userContext = getContext<MyUserContext>('myUserContext');
  const isSignedIn = $derived(userContext.isSignedIn);
</script>

<div class="grid flex-1 place-items-center">
  <div class="flex flex-col items-center px-4 text-center">
    <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
      {m['welcome']()}
    </h1>

    <p class="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground">
      {m['welcome_subtitle']()}
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      {#if !isSignedIn}
        <Button
          variant="default"
          size="lg"
          class="shadow-lg transition-all hover:scale-105 hover:shadow-primary/25 active:scale-100"
          href="/signup"
        >
          {m['get_started']()}
        </Button>
      {/if}
    </div>
  </div>
</div>
