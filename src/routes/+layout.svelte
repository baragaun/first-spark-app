<script lang="ts">
  import { setMode } from 'mode-watcher';
  import '../app.css';
  import { page } from '$app/state';
  import { ModeWatcher } from 'mode-watcher';
  import AppSidebar from '@/components/layout/app-sidebar.svelte';
  import BottomNavbar from '@/components/layout/bottom-navbar.svelte';
  import ConnectionSonner from '@/components/connection-sonner.svelte';
  import NavBar from '@/components/layout/nav-bar/nav-bar.svelte';
  import Footer from '@/components/layout/footer.svelte';
  import { SidebarProvider } from '@/components/ui/sidebar';
  import MyUserProvider from '@/contexts/my-user-provider.svelte';
  import { locales, localizeHref } from '@/paraglide/runtime';
  import { appTitle, appDescription, appCanonicalUrl } from '@/stores/app-store.svelte';
  import MetaTags from '@/components/shared/meta-tags.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

  const isMobile = new IsMobile();

  let { children } = $props();
  let hideNavBar: boolean = $derived(
    page.url.pathname.startsWith('/marketplace/') ||
      page.url.pathname.startsWith('/wallet/') ||
      page.url.pathname.startsWith('/order-history/'),
  );

  $effect(() => {
    setMode('light');
  });
</script>

<MetaTags title={appTitle()} description={appDescription()} canonicalUrl={appCanonicalUrl()} />

<MyUserProvider>
  <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
    <ModeWatcher />
    <ConnectionSonner />
    <SidebarProvider>
      <AppSidebar />
      <div class="flex flex-1 flex-col">
        {#if !hideNavBar}
          <NavBar />
        {/if}
        <main class="flex flex-1 flex-col">
          {@render children?.()}
        </main>
        {#if !isMobile.current}
          <Footer />
        {/if}
      </div>
      <BottomNavbar />
    </SidebarProvider>
  </div>
</MyUserProvider>

<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
