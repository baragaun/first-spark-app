<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { goto } from '$app/navigation';
  import { Languages, LogIn, LogOut, Moon, MoreHorizontal, Sun } from 'lucide-svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { toggleMode } from 'mode-watcher';

  const isSignedIn = $derived(myUserContext.isSignedIn);
  const username = $derived(myUserContext.myUserHandle);
  const email = $derived(myUserContext.myEmail);

  const handleLogout = async () => {
    // TODO: add a confirmation dialog
    // Solution for putting a dialog in a dropdown menu:
    // https://stackoverflow.com/questions/77185827/shadcn-dialog-inside-of-dropdown-closes-automatically
    const result = await myUserContext.signMeOut();
    await goto('/signin');
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="ml-2 {!isSignedIn ? 'md:hidden' : ''}">
    <Button variant="ghost" data-testid="avatar-menu-trigger" class="relative h-8 w-8 rounded-full">
      {#if isSignedIn}
        <Avatar.Root class="h-9 w-9">
          <Avatar.Image src="" alt={`@${username}`} />
          <Avatar.Fallback>FS</Avatar.Fallback>
        </Avatar.Root>
      {:else}
        <MoreHorizontal class="h-5 w-5" />
      {/if}
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="mt-2 w-56" align="end">
    {#if isSignedIn}
      <DropdownMenu.Label class="font-normal">
        <div class="flex items-center">
          <Avatar.Root class="mr-2 h-9 w-9">
            <Avatar.Image src="" alt={`@${username}`} />
            <Avatar.Fallback>🙃</Avatar.Fallback>
          </Avatar.Root>
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-medium leading-none">{username}</p>
            <p class="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
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
    {#if isSignedIn}
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
  </DropdownMenu.Content>
</DropdownMenu.Root>
