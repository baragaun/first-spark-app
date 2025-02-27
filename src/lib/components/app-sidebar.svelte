<script lang="ts">
	import House from 'lucide-svelte/icons/house';
	import Inbox from 'lucide-svelte/icons/inbox';
	import Settings from 'lucide-svelte/icons/settings';
	import BookUser from 'lucide-svelte/icons/book-user';
	import MessageSquare from 'lucide-svelte/icons/message-square';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import { fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import { page } from '$app/stores';

	const sidebar = useSidebar();

	// Get current path for active state
	let currentPath = $derived($page.url.pathname);

	const items = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Inbox',
			url: '#',
			icon: Inbox
		},
		{
			title: 'Conversations',
			url: '#',
			icon: MessageSquare
		},
		{
			title: 'Contacts',
			url: '#',
			icon: BookUser
		},
		{
			title: 'Settings',
			url: '/settings',
			icon: Settings
		}
	];

	// Check if item is active
	function isActive(url: string): boolean {
		return currentPath === url;
	}
</script>

<div class="flex">
	<Sidebar.Root collapsible="icon">
		<Sidebar.Content>
			<div class="mt-2 flex items-center p-2">
				<a href="/" class="flex items-center gap-2 transition-colors hover:opacity-90">
					<div in:fly={{ x: -20, duration: 300, delay: 100, easing: quartOut }}>
						<img src="/fs-logo.svg" alt="App Logo" class="h-8 w-8" />
					</div>
					{#if sidebar.state !== 'collapsed'}
						<span
							in:fly={{ x: -20, duration: 300, delay: 200, easing: quartOut }}
							out:fly={{ x: -20, duration: 200, easing: quartOut }}
							class="font-lexend text-xl font-bold text-primary"
						>
							First Spark
						</span>
					{/if}
				</a>
			</div>

			<Sidebar.Group>
				<Sidebar.Menu>
					{#each items as item, i (item.title)}
						<div in:fly={{ x: -20, duration: 300, delay: 150 + i * 50, easing: quartOut }}>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={isActive(item.url)}>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon />
											{#if sidebar.state !== 'collapsed'}
												<span
													in:fly={{ x: -20, duration: 300, delay: 200, easing: quartOut }}
													out:fly={{ x: -20, duration: 200, easing: quartOut }}
												>
													{item.title}
												</span>
											{/if}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						</div>
					{/each}
				</Sidebar.Menu>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</div>
