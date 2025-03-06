<script lang="ts" context="module">
  // Export the auth store at module level
  export const authStore = writable({
    isAuthenticated: false,
  });
</script>

<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Moon, Sun, Languages, MoreHorizontal } from 'lucide-svelte';
  import UserNav from './user-nav.svelte';
  import * as Sheet from '$lib/components/ui/sheet';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import fsdata from '$lib/services/fsdata/fsdata';

  // Check authentication status on mount
  onMount(() => {
    authStore.set({ isAuthenticated: fsdata.isSignedIn() });

    // Listen for auth state changes
    window.addEventListener('storage', () => {
      authStore.set({ isAuthenticated: fsdata.isSignedIn() });
    });
  });

  // Subscribe to auth store changes
  $: isAuthenticated = $authStore.isAuthenticated;

  // Theme state management
  let isDarkMode = false;
  let isMobileMenuOpen = false;

  onMount(() => {
    const storedTheme = localStorage.getItem('theme');
    if (
      storedTheme === 'dark' ||
      (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  });

  const toggleTheme = () => {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  };
</script>

<nav
  class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
  <div class="flex h-16 items-center px-4">
    <!-- Sidebar Trigger (Both Mobile and Desktop) -->
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
    <div class="flex flex-none items-center gap-4">
      <!-- Theme Toggle (Desktop Only) -->
      <Button
        variant="ghost"
        size="icon"
        onclick={toggleTheme}
        class="hidden text-muted-foreground hover:text-foreground md:flex"
        aria-label="Toggle theme"
      >
        {#if isDarkMode}
          <Sun class="h-5 w-5 transition-all" />
        {:else}
          <Moon class="h-5 w-5 transition-all" />
        {/if}
      </Button>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex md:items-center md:gap-4">
        <!-- Language Switcher -->
        <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-foreground">
          <Languages class="h-5 w-5" />
        </Button>

        {#if isAuthenticated}
          <UserNav />
        {:else}
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              href="/signin"
              class="font-lexend text-muted-foreground hover:text-foreground"
            >
              Log In
            </Button>
            <Button variant="default" href="/signup" class="font-lexend shadow-sm hover:shadow-md">
              Sign Up
            </Button>
          </div>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex md:hidden">
        <div class="text-muted-foreground hover:text-foreground">
          <MoreHorizontal
            onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
            class="h-10 w-10 p-2"
          />
          <span class="sr-only">Open Menu</span>
        </div>
        {#if isAuthenticated}
          <UserNav />
        {/if}
      </div>
    </div>
  </div>
</nav>

<!-- Mobile Menu Sheet -->
<Sheet.Root bind:open={isMobileMenuOpen}>
  <Sheet.Content side="right" class="w-[300px]">
    <div class="flex flex-col gap-4 p-6">
      <h2 class="font-lexend text-lg font-semibold">Menu</h2>

      <div class="flex flex-col gap-4">
        <!-- Mobile Menu Items -->
        <div class="flex flex-col gap-2">
          <!-- Theme Toggle -->
          <Button
            variant="ghost"
            onclick={toggleTheme}
            class="font-lexend w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            {#if isDarkMode}
              <Sun class="h-5 w-5" />
              <span>Light Mode</span>
            {:else}
              <Moon class="h-5 w-5" />
              <span>Dark Mode</span>
            {/if}
          </Button>

          <!-- Language Selection -->
          <Button
            variant="ghost"
            class="font-lexend w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Languages class="h-5 w-5" />
            <span>Change Language</span>
          </Button>

          <!-- Auth Buttons -->
          {#if isAuthenticated}
            <Button
              variant="destructive"
              href="/signout"
              class="font-lexend w-full justify-start text-muted-foreground hover:text-foreground"
              onclick={() => (isMobileMenuOpen = false)}
            >
              Sign Out
            </Button>
          {:else}
            <Button
              variant="secondary"
              href="/signin"
              class="font-lexend w-full justify-start text-muted-foreground hover:text-foreground"
              onclick={() => (isMobileMenuOpen = false)}
            >
              Log In
            </Button>
            <Button
              variant="default"
              href="/signup"
              class="font-lexend w-full justify-start shadow-sm hover:shadow-md"
              onclick={() => (isMobileMenuOpen = false)}
            >
              Sign Up
            </Button>
          {/if}
        </div>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>
