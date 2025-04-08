<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import type { Snippet } from 'svelte';
  import Button from './ui/button/button.svelte';

  interface Props {
    children?: Snippet;
    title: string;
    description?: string;
    showBackButton?: boolean;
    onBack?: () => void;
  }

  let { title, description, showBackButton = false, onBack, children }: Props = $props();
</script>

{#if showBackButton && onBack}
  <Button variant="secondary" size="sm" class="absolute -top-12 left-0" onclick={onBack}
    >← Back</Button
  >
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
    {@render children?.()}
  </CardContent>
</Card>
