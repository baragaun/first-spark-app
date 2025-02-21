<script lang="ts">
	import '../app.css';
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
	import UserNav from '@/components/user-nav.svelte';

    let { children } = $props();
    let open = $state(true);
</script>
<div class="min-h-screen bg-background font-sans antialiased">
<UserNav />
<Sidebar.Provider bind:open>
    <AppSidebar />
    <main class="flex-1 h-full">
        {#if !open}
            <Sidebar.Trigger />
        {/if}
        {@render children?.()}
    </main>
</Sidebar.Provider>
</div>