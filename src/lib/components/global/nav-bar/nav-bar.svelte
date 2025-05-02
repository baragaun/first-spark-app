<script lang="ts">
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { m } from '$lib/paraglide/messages.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AvatarMenu from './avatar-menu.svelte';
  import ConnectionIndicator from './connection-indicator.svelte';
  import LanguageButton from '../../language-button.svelte';
  import ThemeButton from '../../light-switch.svelte';
  import { Button } from '$lib/components/ui/button';
  import { LogIn } from 'lucide-svelte';

  const isSignedIn = $derived(myUserContext.isSignedIn);
</script>

<nav
  class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
  <div class="flex h-16 items-center px-4">
    <!-- Sidebar Trigger -->
    <div class="mr-1 flex-none">
      <Sidebar.Trigger />
    </div>

    <!-- Logo and App Name (Mobile Only) -->
    <div class="flex flex-1 justify-start md:justify-center">
      <a href="/" class="flex items-center gap-2 transition-colors hover:opacity-90 md:hidden">
        <img src="/fs-logo.svg" alt="App Logo" class="h-8 w-8" />
      </a>
    </div>

    <!-- Right side items -->
    <div class="flex flex-none items-center gap-2">
      <ConnectionIndicator />
      <ThemeButton class="hidden md:flex" />
      <LanguageButton class="hidden md:flex" />
      {#if !isSignedIn}
        <div class="flex flex-none items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onclick={() => goto('/signin')}
            aria-label={m['nav.auth.sign_in']()}
            class="font-lexend text-muted-foreground hover:text-foreground"
          >
            <LogIn class="mr-2 h-4 w-4" />
          </Button>
          <span class="sr-only">Sign In</span>
          <Button
            variant="default"
            onclick={() => goto('/signup')}
            aria-label={m['nav.auth.sign_up']()}
            class="font-lexend shadow-sm hover:shadow-md"
          >
            {m['nav.auth.sign_up']()}
          </Button>
          <span class="sr-only">{m['nav.auth.sign_up']()}</span>
        </div>
      {:else}
        <AvatarMenu />
      {/if}
    </div>
  </div>
</nav>
