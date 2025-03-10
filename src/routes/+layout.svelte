<script lang="ts">
  import '../app.css';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import NavBar from '@/components/nav-bar.svelte';
  import Footer from '$lib/components/footer.svelte';
  import { browser } from '$app/environment';
  import { waitLocale } from 'svelte-i18n';
  import { initI18n } from '$lib/i18n/index';
  import { onMount } from 'svelte';

  let { children } = $props();
  let open = $state(true);
  let ready = $state(false);

  onMount(async () => {
    if (browser) {
      initI18n();
      await waitLocale();
      ready = true;
    }
  });
</script>

{#if ready}
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
{:else}
  <div class="grid min-h-screen place-items-center">
    <div class="text-lg">Loading...</div>
  </div>
{/if}
