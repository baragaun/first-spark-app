<script lang="ts" context="module">
  // Export the auth store at module level
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  export const authStore = writable({
    isAuthenticated: false,
  });
</script>

<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Moon, Sun, Languages } from 'lucide-svelte';
  import AvatarMenu from './avatar-menu.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  // Update auth store when localStorage changes
  const updateAuthState = () => {
    const authToken = localStorage.getItem('authToken');
    authStore.set({ isAuthenticated: !!authToken });
  };

  // Check authentication status on mount
  onMount(() => {
    updateAuthState();

    // Listen for auth state changes
    window.addEventListener('storage', () => {
      updateAuthState();
    });
  });

  // Theme state management
  let isDarkMode = false;

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
      <Button
        variant="ghost"
        size="icon"
        class="hidden text-muted-foreground hover:text-foreground md:flex"
        aria-label="Change language"
        >
        <Languages class="h-5 w-5" />
      </Button>
      <div class="flex items-center gap-2">
        <Button variant="ghost" href="/signin" class="hidden font-lexend text-muted-foreground hover:text-foreground md:flex">
          Sign In
        </Button>
        <Button variant="default" href="/signup" class="font-lexend shadow-sm hover:shadow-md">
          Sign Up
        </Button>
        <AvatarMenu />
      </div>
    </div>
  </div>
</nav>