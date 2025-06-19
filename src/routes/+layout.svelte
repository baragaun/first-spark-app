<script lang="ts">
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { ModeWatcher } from 'mode-watcher';
  import AppSidebar from '@/components/layout/app-sidebar.svelte';
  import ConnectionSonner from '@/components/connection-sonner.svelte';
  import NavBar from '@/components/layout/nav-bar/nav-bar.svelte';
  import Footer from '@/components/layout/footer.svelte';
  import { SidebarProvider } from '@/components/ui/sidebar';
  import MyUserProvider from '@/contexts/my-user-provider.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { locales, localizeHref } from '@/paraglide/runtime';
  import type { MyUser } from '@baragaun/bg-node-client';
  import { onMount } from 'svelte';
  import MetaTags from '$lib/components/shared/meta-tags.svelte';
  import { env } from '$env/dynamic/public';
  import { appTitle, appDescription, appCanonicalUrl } from '$lib/stores/app-store';

  let { children } = $props();
  let isOffline: boolean = $derived(myUserContext.isOffline);
  let isAuthenticated: boolean = $derived(myUserContext.isSignedIn);
  let myUser: MyUser | undefined = $derived(myUserContext.myUser);

  // Check if current route is marketplace detail page
  let showNavBar = $derived(
    !page.url.pathname.startsWith('/marketplace/') &&
      !page.url.pathname.startsWith('/wallet/upload-card'),
  );

  onMount(() => {
    let projectName = env.PUBLIC_PROJECTNAME;
    if (projectName === 'KCU') {
      setFavicon('/favicon-kcu.png');
    }
  });

  function setFavicon(src: string, type = 'image/png') {
    let link = document.getElementById('favicon') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = 'favicon';
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = type;
    link.href = src;
  }

  const onSignOut = async () => {
    // TODO: add a confirmation dialog
    // Solution for putting a dialog in a dropdown menu:
    // https://stackoverflow.com/questions/77185827/shadcn-dialog-inside-of-dropdown-closes-automatically
    await myUserContext.signMeOut();
    await goto('/signin');
  };
</script>

<MetaTags title={$appTitle} description={$appDescription} canonicalUrl={$appCanonicalUrl} />

<MyUserProvider>
  <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
    <ModeWatcher />
    <ConnectionSonner clientConnection={isOffline} />
    <SidebarProvider>
      <AppSidebar bind:isOffline {isAuthenticated} />
      <div class="flex flex-1 flex-col">
        {#if showNavBar}
          <NavBar {myUser} {isAuthenticated} {onSignOut} />
        {/if}
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
