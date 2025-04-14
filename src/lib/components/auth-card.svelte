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

<Card class="w-full">
  {#if showBackButton && onBack}
    <div class="px-4 pt-4">
      <Button variant="ghost" size="sm" onclick={onBack}>← Back</Button>
    </div>
  {/if}
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
