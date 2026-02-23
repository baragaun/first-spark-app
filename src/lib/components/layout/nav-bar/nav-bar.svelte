<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Sidebar from '@/components/ui/sidebar';
  import * as Tooltip from '@/components/ui/tooltip';
  import { Button } from '@/components/ui/button';
  import { m } from '@/paraglide/messages.js';
  import { LogIn } from 'lucide-svelte';
  import LanguageButton from './language-button.svelte';
  import ThemeButton from './light-switch.svelte';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { getContext } from 'svelte';
  import type { MyUser } from '@baragaun/bg-node-client';
  import { getPurchaseOrdersStore } from '$lib/stores/order-history.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
  import { headerSmallIcon } from '@/stores/app-store.svelte';

  const purchaseOrdersStore = getPurchaseOrdersStore();

  const userContext = getContext<MyUserContext>('myUserContext');
  let isSignedIn: boolean = $derived(userContext.isSignedIn);
  let myUser: MyUser | undefined = $derived(userContext.myUser);

  const isMobile = new IsMobile();

  const onSignOut = async () => {
    purchaseOrdersStore.reset();
    await userContext.signMeOut();
    await goto('/signin');
  };
</script>

<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-soft supports-[backdrop-filter]:bg-white/75">
  <div class="flex h-16 items-center px-4 md:px-6">
    <!-- Sidebar Trigger -->
    <div class="mr-2 hidden flex-none text-primary md:block">
      <Sidebar.Trigger />
    </div>

    {#if isMobile.current}
      <div class="flex items-center">
        <img src={headerSmallIcon()} alt="Logo" class="h-9 w-auto" />
      </div>
    {/if}

    <!-- Right side items -->
    <div class="ml-auto flex flex-none items-center gap-2">
      <LanguageButton class="flex" />
      {#if !isSignedIn}
        <div class="flex flex-none items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onclick={() => goto('/signin')}
            class="text-primary hover:bg-primary/5 hover:text-primary"
          >
            <LogIn class="mr-1.5 h-4 w-4" />
            {m['nav.auth.sign_in']()}
          </Button>
          <Button
            variant="default"
            size="sm"
            onclick={() => goto('/signup')}
            aria-label={m['nav.auth.sign_up']()}
            class="rounded-full bg-primary px-5 text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {m['nav.auth.sign_up']()}
          </Button>
        </div>
        <!-- {:else}
        <AvatarMenu {myUser} {onSignOut} /> -->
      {/if}
    </div>
  </div>
</nav>
