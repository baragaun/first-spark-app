<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import AvatarMenu from './avatar-menu.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import ThemeButton from '../theme-button.svelte';
  import LanguageButton from '../language-button.svelte';
  import { isSignedIn } from '@/contexts/my-user-context.svelte';
  import { goto } from '$app/navigation';
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
      {#if !$isSignedIn}
        <div class="flex flex-none items-center gap-2">
          <ThemeButton class="hidden md:flex" />
          <LanguageButton class="hidden md:flex" />
          <Button
            variant="ghost"
            onclick={() => goto('/signin')}
            aria-label="Sign In"
            class="font-lexend hidden text-muted-foreground hover:text-foreground md:flex"
          >
            Sign In
          </Button>
          <span class="sr-only">Sign In</span>
          <Button
            variant="default"
            onclick={() => goto('/signup')}
            aria-label="Sign Up"
            class="font-lexend shadow-sm hover:shadow-md"
          >
            Sign Up
          </Button>
          <span class="sr-only">Sign Up</span>
        </div>
      {/if}
      <AvatarMenu />
    </div>
  </div>
</nav>
