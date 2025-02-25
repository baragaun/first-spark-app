<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import type { ComponentProps } from 'svelte';
	import { cn } from '$lib/utils.js';
	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		class: className,
		placeholder = 'Password',
		...restProps
	}: ComponentProps<typeof Input> = $props();

	let showPassword = $state(false);

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};
</script>

<div class="relative w-full">
	<Input
		bind:ref
		bind:value
		type={showPassword ? 'text' : 'password'}
		{placeholder}
		class={cn('pr-10', className)}
		{...restProps}
	/>
	<button
		type="button"
		class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
		onclick={togglePasswordVisibility}
		tabindex="-1"
		aria-label={showPassword ? 'Hide password' : 'Show password'}
	>
		{#if showPassword}
			<Eye size={20} />
		{:else}
			<EyeOff size={20} />
		{/if}
	</button>
</div>
