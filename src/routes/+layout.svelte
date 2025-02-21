<script lang="ts">
    import "../app.css";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import UserNav from "$lib/components/user-nav.svelte";
    import AppSidebar from "$lib/components/app-sidebar.svelte";

    let { children } = $props();
    let open = $state(true);
</script>

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
