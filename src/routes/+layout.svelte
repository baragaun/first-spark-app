<script lang="ts">
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { ModeWatcher } from 'mode-watcher';
  import AppSidebar from '@/components/global/app-sidebar.svelte';
  import ConnectionSonner from '@/components/connection-sonner.svelte';
  import NavBar from '@/components/global/nav-bar/nav-bar.svelte';
  import Footer from '@/components/global/footer.svelte';
  import { SidebarProvider } from '@/components/ui/sidebar';
  import MyUserProvider from '@/contexts/my-user-provider.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { locales, localizeHref } from '@/paraglide/runtime';
  import type { MyUser } from '@baragaun/bg-node-client';

  let { children } = $props();
  let isOffline: boolean = $derived(myUserContext.isOffline);
  let isAuthenticated: boolean = $derived(myUserContext.isSignedIn);
  let myUser: MyUser | undefined = $derived(myUserContext.myUser);

  const onSignOut = async () => {
    // TODO: add a confirmation dialog
    // Solution for putting a dialog in a dropdown menu:
    // https://stackoverflow.com/questions/77185827/shadcn-dialog-inside-of-dropdown-closes-automatically
    await myUserContext.signMeOut();
    await goto('/signin');
  };
</script>

<MyUserProvider>
  <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
    <ModeWatcher />
    <ConnectionSonner clientConnection={isOffline} />
    <SidebarProvider>
      <AppSidebar bind:isOffline {isAuthenticated} />
      <div class="flex flex-1 flex-col">
        <NavBar {myUser} {isAuthenticated} {onSignOut} />
        <main class="flex flex-1 flex-col">
          {@render children?.()}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  </div>
</MyUserProvider>

<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
