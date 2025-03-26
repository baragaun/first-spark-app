<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import AvatarMenu from './avatar-menu.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import ThemeButton from '../theme-button.svelte';
  import LanguageButton from '../language-button.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  const isAuthenticated = $derived(myUserContext.isAuthenticated);
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
      <ThemeButton class="hidden md:flex" />
      <LanguageButton class="hidden md:flex" />
      <div class="flex items-center gap-2">
        {#if !isAuthenticated}
          <Button
            variant="ghost"
            href="/signin"
            class="font-lexend hidden text-muted-foreground hover:text-foreground md:flex"
          >
            Sign In
          </Button>
          <Button variant="default" href="/signup" class="font-lexend shadow-sm hover:shadow-md">
            Sign Up
          </Button>
        {/if}
        <AvatarMenu />
      </div>
    </div>
  </div>
</nav>
