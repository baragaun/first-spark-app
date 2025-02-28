<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import Button from './button/button.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let showBackButton: boolean = false;
	export let onBack: (() => void) | undefined = undefined;
</script>

{#if showBackButton && onBack}
	<Button variant="ghost" size="sm" class="absolute -top-12 left-0" onclick={onBack}>← Back</Button>
{/if}

<Card class="relative w-full max-w-md">
	<CardHeader>
		<CardTitle class="text-2xl">{title}</CardTitle>
		{#if description}
			<CardDescription>
				{description}
			</CardDescription>
		{/if}
	</CardHeader>
	<CardContent>
		<slot />
	</CardContent>
</Card>
