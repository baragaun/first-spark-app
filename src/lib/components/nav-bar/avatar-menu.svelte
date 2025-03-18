<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { goto } from '$app/navigation';
  import { Languages, LogIn, LogOut, Moon, MoreHorizontal, Sun } from 'lucide-svelte';
  import { authStore } from './nav-bar.svelte';
  import { toggleMode } from "mode-watcher";

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    authStore.set({ isAuthenticated: false }); // Update auth store
    goto('/signin');
  };
  
  $: isAuthenticated = $authStore?.isAuthenticated ?? false;
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
        <DropdownMenu.Item onclick={toggleMode}>
          <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          Toggle theme
        </DropdownMenu.Item>
        <DropdownMenu.Item>
        <Languages class="h-5 w-5 transition-all" />
          Change language
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