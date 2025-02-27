<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import NavBar from '@/components/nav-bar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();
	let open = $state(true);
</script>

<div class="min-h-screen flex flex-col bg-background font-sans antialiased">
	<Sidebar.Provider bind:open>
		<AppSidebar />
		<main class="flex-1 flex flex-col">
			<Sidebar.Trigger />
			<div class="flex-1">
				{@render children?.()}
			</div>
			<Footer />
		</main>
	</Sidebar.Provider>
</div>
