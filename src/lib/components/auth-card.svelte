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
  import { headerSmallIcon } from '@/stores/app-store.svelte';

  interface Props {
    children?: Snippet;
    title: string;
    description?: string;
    showBackButton?: boolean;
    onBack?: () => void;
  }

  let { title, description, showBackButton = false, onBack, children }: Props = $props();
</script>

<div class="flex flex-col items-center">
  <!-- Logo above card -->
  <div class="mb-6">
    <img src={headerSmallIcon()} alt="Logo" class="h-12 w-auto" />
  </div>

  <Card class="w-full overflow-hidden shadow-soft-lg">
    {#if showBackButton && onBack}
      <div class="px-5 pt-4">
        <Button variant="ghost" size="sm" onclick={onBack} class="text-muted-foreground hover:text-foreground">← Back</Button>
      </div>
    {/if}
    <CardHeader class="pb-2 pt-6">
      <CardTitle class="break-words text-center text-xl font-bold text-foreground">{title}</CardTitle>
      {#if description}
        <CardDescription class="break-words text-center text-sm">
          {description}
        </CardDescription>
      {/if}
    </CardHeader>
    <CardContent class="w-full px-6 pb-6">
      {@render children?.()}
    </CardContent>
  </Card>
</div>
