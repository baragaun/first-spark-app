<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { m } from '$lib/paraglide/messages.js';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { ArrowUpRight, LogIn, LogOut, MoreHorizontal, Settings } from 'lucide-svelte';

  const isSignedIn = $derived(myUserContext.isSignedIn);
  const username = $derived(myUserContext.myUserHandle);
  const email = $derived(myUserContext.myEmail);

  const handleLogout = async () => {
    // TODO: add a confirmation dialog
    // Solution for putting a dialog in a dropdown menu:
    // https://stackoverflow.com/questions/77185827/shadcn-dialog-inside-of-dropdown-closes-automatically
    await myUserContext.signMeOut();
    await goto('/signin');
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="ml-2">
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
      <DropdownMenu.Item onclick={() => goto('/settings')}>
        <Settings class="mr-2 size-4" />
        <span>{m['user_nav.settings']()}</span>
        <DropdownMenu.Shortcut><ArrowUpRight /></DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    {#if isSignedIn}
      <DropdownMenu.Item onclick={handleLogout}>
        <LogOut class="mr-2 h-4 w-4" />
        {m['nav.auth.sign_out']()}
      </DropdownMenu.Item>
    {:else}
      <DropdownMenu.Item onclick={() => goto('/signin')}>
        <LogIn class="mr-2 h-4 w-4" />
        {m['nav.auth.sign_in']()}
      </DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
