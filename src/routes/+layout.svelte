<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { ModeWatcher } from 'mode-watcher';
  import AppSidebar from '@/components/layout/app-sidebar.svelte';
  import ConnectionSonner from '@/components/connection-sonner.svelte';
  import NavBar from '@/components/layout/nav-bar/nav-bar.svelte';
  import Footer from '@/components/layout/footer.svelte';
  import { SidebarProvider } from '@/components/ui/sidebar';
  import MyUserProvider from '@/contexts/my-user-provider.svelte';
  import { locales, localizeHref } from '@/paraglide/runtime';

  let { children } = $props();
</script>

<MetaTags {title} {description} {canonicalUrl} />

<MyUserProvider>
  <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
    <ModeWatcher />
    <ConnectionSonner />
    <SidebarProvider>
      <AppSidebar />
      <div class="flex flex-1 flex-col">
        <NavBar />
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
