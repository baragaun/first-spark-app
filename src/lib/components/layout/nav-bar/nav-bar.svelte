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
  import { getPurchaseOrdersStore } from '$lib/stores/order-history.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
  import { headerSmallIcon } from '@/stores/app-store';

  const purchaseOrdersStore = getPurchaseOrdersStore();

  const userContext = getContext<MyUserContext>('myUserContext');
  let isSignedIn: boolean = $derived(userContext.isSignedIn);
  let myUser: MyUser | undefined = $derived(userContext.myUser);

  const isMobile = new IsMobile();

  const onSignOut = async () => {
    // TODO: add a confirmation dialog
    // Solution for putting a dialog in a dropdown menu:
    // https://stackoverflow.com/questions/77185827/shadcn-dialog-inside-of-dropdown-closes-automatically
    purchaseOrdersStore.reset();
    await userContext.signMeOut();
    await goto('/signin');
  };
</script>

<nav class="sticky top-0 z-50 border-b bg-nav backdrop-blur supports-[backdrop-filter]:bg-nav">
  <div class="flex h-16 items-center px-4">
    <!-- Sidebar Trigger -->
    <div class="mr-1 flex-none text-nav-foreground hidden md:block">
      <Sidebar.Trigger />
    </div>

    {#if isMobile.current}
      <div class="flex items-center justify-center">
        <img src={$headerSmallIcon} alt="First Spark Logo" class="h-10" />
      </div>
    {/if}

    <!-- Right side items -->
    <div class="ml-auto flex flex-none items-center gap-1">
      <ThemeButton class="flex" />
      <LanguageButton class="flex" />
      {#if !isSignedIn}
        <div class="flex flex-none items-center gap-2">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <div class="relative inline-flex" aria-label={m['nav.auth.sign_in']()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onclick={() => goto('/signin')}
                    class="font-lexend text-nav-foreground hover:text-nav-foreground"
                  />
                  <LogIn
                    class="pointer-events-none absolute inset-0 m-auto h-[1.3rem] w-[1.3rem] text-nav-foreground"
                  />
                </div>
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
            class="font-lexend text-nav"
          >
            {m['nav.auth.sign_up']()}
          </Button>
          <span class="sr-only">{m['nav.auth.sign_up']()}</span>
        </div>
      <!-- {:else}
        <AvatarMenu {myUser} {onSignOut} /> -->
      {/if}
    </div>
  </div>
</nav>
