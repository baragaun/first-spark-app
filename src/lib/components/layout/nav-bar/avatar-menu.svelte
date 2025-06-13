<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Avatar from '@/components/ui/avatar';
  import { Button } from '@/components/ui/button';
  import * as DropdownMenu from '@/components/ui/dropdown-menu';
  import { m } from '@/paraglide/messages.js';
  import type { MyUser } from '@baragaun/bg-node-client';
  import { ArrowUpRight, LogOut, Settings } from 'lucide-svelte';

  let {
    myUser,
    onSignOut,
  }: {
    myUser: MyUser | undefined;
    onSignOut: () => Promise<void>;
  } = $props();

  let myUsername = $derived(myUser?.userHandle || '');
  let myEmail = $derived(myUser?.email || '');

  const handleLogout = async () => {
    await onSignOut();
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="ml-2">
    <Button
      variant="ghost"
      data-testid="avatar-menu-trigger"
      class="relative h-8 w-8 rounded-full transition-colors hover:text-primary"
    >
      <Avatar.Root class="h-9 w-9">
        <Avatar.Image src="" alt={`@${myUsername}`} />
        <Avatar.Fallback>FS</Avatar.Fallback>
      </Avatar.Root>
    </Button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content class="mt-2 w-56 bg-background" align="end">
    <DropdownMenu.Label class="font-normal">
      <div class="flex items-center">
        <Avatar.Root class="mr-2 h-9 w-9">
          <Avatar.Image src="" alt={`@${myUsername}`} />
          <Avatar.Fallback>🙃</Avatar.Fallback>
        </Avatar.Root>
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">{myUsername}</p>
          <p class="text-xs leading-none text-muted-foreground">{myEmail}</p>
        </div>
      </div>
    </DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item onclick={() => goto('/settings')}>
        <Settings class="mr-2 size-4" />
        <span>{m['user_nav.settings']()}</span>
        <DropdownMenu.Shortcut><ArrowUpRight /></DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={handleLogout}>
      <LogOut class="mr-2 h-4 w-4" />
      {m['nav.auth.sign_out']()}
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
