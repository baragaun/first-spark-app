<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import NavBar from '@/components/nav-bar.svelte';

	let { children } = $props();
	let open = $state(true);
</script>

<div class="min-h-screen bg-background font-sans antialiased">
	<Sidebar.Provider bind:open>
		<AppSidebar />
		<main class="h-full flex-1">
			<NavBar />
			{@render children?.()}
		</main>
	</Sidebar.Provider>
</div>
