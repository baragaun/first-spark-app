<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import NavBar from '@/components/nav-bar/nav-bar.svelte';
  import Footer from '$lib/components/footer.svelte';
  import MyUserProvider from '@/contexts/my-user-provider.svelte';
  import ConnectionSonner from '$lib/components/connection-sonner.svelte';
  import { locales, localizeHref } from '$lib/paraglide/runtime';
  import { page } from '$app/state';

  let { children } = $props();
</script>

<MyUserProvider>
  <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
    <ModeWatcher />
    <ConnectionSonner />
    <Sidebar.Provider>
      <AppSidebar />
      <div class="flex flex-1 flex-col">
        <NavBar />
        <main class="flex flex-1 flex-col">
          {@render children?.()}
        </main>
        <Footer />
      </div>
    </Sidebar.Provider>
  </div>
</MyUserProvider>

<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
