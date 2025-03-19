<script lang="ts">
  import '../app.css';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import NavBar from '@/components/nav-bar.svelte';
  import Footer from '$lib/components/footer.svelte';
  import MyUserProvider from '$lib/context/MyUserProvider.svelte';

  let { children, data } = $props();
  let open = $state(true);
</script>

{#if data.initialized}
  <MyUserProvider>
    <div class="flex min-h-screen flex-col bg-background font-sans antialiased">
      <Sidebar.Provider bind:open>
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
