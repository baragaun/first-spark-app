<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import NavBar from '@/components/nav-bar/nav-bar.svelte';
  import Footer from '$lib/components/footer.svelte';
  import MyUserProvider from '@/context/my-user-provider.svelte';

  let { children, data } = $props();
</script>

{#if data.initialized}
  <MyUserProvider>
    <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
      <ModeWatcher />
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
{:else if data.error}
  <div class="error-container">
    <p>Failed to initialize app: {data.error}</p>
  </div>
{:else}
  <div class="loading-container">
    <p>Loading...</p>
  </div>
{/if}
