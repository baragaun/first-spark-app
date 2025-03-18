<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { goto } from '$app/navigation';
  import { Languages, LogIn, LogOut, Moon, MoreHorizontal, Sun } from 'lucide-svelte';
  import { authStore } from './nav-bar.svelte';
  import { onMount } from 'svelte';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    authStore.set({ isAuthenticated: false }); // Update auth store
    goto('/signin');
  };
  
  $: isAuthenticated = $authStore?.isAuthenticated ?? false;
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

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="md:hidden ml-2">
    <Button variant="ghost" class="relative h-8 w-8 rounded-full">
      {#if isAuthenticated}
        <Avatar.Root class="h-9 w-9">
          <Avatar.Image src="" alt="@shadcn" />
          <Avatar.Fallback>FS</Avatar.Fallback>
        </Avatar.Root>
      {:else}
        <MoreHorizontal class="h-5 w-5" />
      {/if}
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56 mt-2" align="end">
    {#if isAuthenticated}
      <DropdownMenu.Label class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">newstudent</p>
          <p class="text-xs leading-none text-muted-foreground">newstudent@example.com</p>
        </div>
      </DropdownMenu.Label>
      <DropdownMenu.Separator />
      {/if}
      <DropdownMenu.Group>
        <DropdownMenu.Item onclick={() => toggleTheme()}>
          {#if isDarkMode}
          <Sun class="h-4 w-4 transition-all" />
          {:else}
          <Moon class="h-4 w-4 transition-all" />
          {/if}
          Toggle theme
        </DropdownMenu.Item>
        <DropdownMenu.Item>
        <Languages class="h-5 w-5 transition-all" />
          Language
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      {#if isAuthenticated}
        <DropdownMenu.Item
          onclick={handleLogout}
          class="bg-destructive text-white focus:bg-destructive focus:text-white"
        >
          <LogOut class="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenu.Item>
      {:else}
        <DropdownMenu.Item onclick={() => goto('/signin')}>
          <LogIn class="mr-2 h-4 w-4" />
          Sign in
        </DropdownMenu.Item>
      {/if}
    <!-- {/if} -->
  </DropdownMenu.Content>
</DropdownMenu.Root>