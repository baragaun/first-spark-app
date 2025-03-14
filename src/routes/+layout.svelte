<script lang="ts">
  import '../app.css';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import NavBar from '@/components/nav-bar.svelte';
  import Footer from '$lib/components/footer.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background font-sans antialiased">
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
