<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Sidebar from '@/components/ui/sidebar';
  import * as Tooltip from '@/components/ui/tooltip';
  import { Button } from '@/components/ui/button';
  import { m } from '@/paraglide/messages.js';
  import { LogIn } from 'lucide-svelte';
  import AvatarMenu from './avatar-menu.svelte';
  import LanguageButton from './language-button.svelte';
  import ThemeButton from './light-switch.svelte';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { getContext } from 'svelte';
  import type { MyUser } from '@baragaun/bg-node-client';

  const userContext = getContext<MyUserContext>('myUserContext');
  let isSignedIn: boolean = $derived(userContext.isSignedIn);
  let myUser: MyUser | undefined = $derived(userContext.myUser);

  const onSignOut = async () => {
    // TODO: add a confirmation dialog
    // Solution for putting a dialog in a dropdown menu:
    // https://stackoverflow.com/questions/77185827/shadcn-dialog-inside-of-dropdown-closes-automatically
    await userContext.signMeOut();
    await goto('/signin');
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
      <ThemeButton class="flex" />
      <LanguageButton class="flex" />
      {#if !isSignedIn}
        <div class="flex flex-none items-center gap-2">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button
                  variant="ghost"
                  size="icon"
                  onclick={() => goto('/signin')}
                  aria-label={m['nav.auth.sign_in']()}
                  class="font-lexend text-muted-foreground hover:text-foreground"
                >
                  <LogIn class="mr-2 h-4 w-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{m['nav.auth.sign_in']()}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
          <span class="sr-only">{m['nav.auth.sign_in']()}</span>
          <Button
            variant="default"
            onclick={() => goto('/signup')}
            aria-label={m['nav.auth.sign_up']()}
            class="font-lexend text-background shadow-sm hover:shadow-md"
          >
            {m['nav.auth.sign_up']()}
          </Button>
          <span class="sr-only">{m['nav.auth.sign_up']()}</span>
        </div>
      {:else}
        <AvatarMenu {myUser} {onSignOut} />
      {/if}
    </div>
  </div>
</nav>
