<script lang="ts">
	import '../app.css';
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import UserNav from "$lib/components/user-nav.svelte";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
	import NavBar from '$lib/components/NavBar.svelte';
	let { children } = $props();
</script>

<div class="min-h-screen bg-background font-sans antialiased">
<Sidebar.Provider>
<AppSidebar />
<main class="flex-1 h-full">
    <!-- <Sidebar.Trigger /> -->
    <NavBar />
    {@render children?.()}
</main>
</Sidebar.Provider>
</div>
