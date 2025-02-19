<script lang="ts">
    import "../app.css";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import UserNav from "$lib/components/user-nav.svelte";
    import AppSidebar from "$lib/components/app-sidebar.svelte";

    let { children } = $props();
</script>

<UserNav />
<Sidebar.Provider>
    <AppSidebar />
    <main class="flex-1 h-full">
        <Sidebar.Trigger />
        {@render children?.()}
    </main>
</Sidebar.Provider>
