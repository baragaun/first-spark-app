<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import NavBar from '@/components/nav-bar/nav-bar.svelte';
  import Footer from '$lib/components/footer.svelte';
  import MyUserProvider from '@/contexts/my-user-provider.svelte';
  import { page } from '$app/state';

  let { children } = $props();

  // Check if current route is a chat detail page
  let isChatDetailPage = $derived(() => {
    return page.url.pathname.startsWith('/chats/') && page.url.pathname !== '/chats/';
  });
</script>

<MyUserProvider>
  <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
    <ModeWatcher />
    <Sidebar.Provider>
      <AppSidebar />
      <div class="flex flex-1 flex-col">
        {#if !isChatDetailPage()}
          <NavBar />
        {/if}
        <main class="flex flex-1 flex-col">
          {@render children?.()}
        </main>
        {#if !isChatDetailPage()}
          <Footer />
        {/if}
      </div>
    </Sidebar.Provider>
  </div>
</MyUserProvider>
