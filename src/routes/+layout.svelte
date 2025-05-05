<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import * as Sidebar from '@components/ui/sidebar/index';
  import AppSidebar from '@components/global/app-sidebar.svelte';
  import NavBar from '@components/global/nav-bar/nav-bar.svelte';
  import Footer from '@components/global/footer.svelte';
  import MyUserProvider from '@contexts/my-user-provider.svelte';
  import ConnectionSonner from '@components/connection-sonner.svelte';
  import { locales, localizeHref } from '@/paraglide/runtime';
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
