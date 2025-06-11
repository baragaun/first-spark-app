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
  import { FirstSparkApp, MimbleApp } from '@/types/enums';
  import MetaTags from '$lib/components/shared/meta-tags.svelte';

  let { children } = $props();
  let isOffline: boolean = $derived(myUserContext.isOffline);
  let isAuthenticated: boolean = $derived(myUserContext.isSignedIn);
  let myUser: MyUser | undefined = $derived(myUserContext.myUser);

  let title = $state('');
  let description = $state('');
  let canonicalUrl = $state('');

  onMount(() => {
    console.log('this is always called?');

    let projectName = import.meta.env.PUBLIC_PROJECTNAME;
    console.log(projectName);
    switch (projectName) {
      case 'FirstSpark':
        title = FirstSparkApp.title;
        description = FirstSparkApp.description;
        canonicalUrl = FirstSparkApp.canonicalUrl;
        break;
      case 'Mimble':
        title = MimbleApp.title;
        description = MimbleApp.description;
        canonicalUrl = MimbleApp.canonicalUrl;
        setFavicon('/favicon-kcu.png');
        break;
      default:
        break;
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

<MetaTags {title} {description} {canonicalUrl} />

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
