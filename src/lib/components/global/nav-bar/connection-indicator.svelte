<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { PlugZap, Wifi } from 'lucide-svelte';
  import { m } from '$lib/paraglide/messages.js';
  import { connectionStore } from '@/stores/connection-store.svelte.js';
</script>

{#if connectionStore.isOffline || connectionStore.isDevelopment}
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button
        variant="ghost"
        size="icon"
        class="text-muted-foreground hover:text-foreground"
        disabled={!connectionStore.isDevelopment}
        onclick={connectionStore.toggleConnection}
        aria-label={connectionStore.isOffline
          ? m['connection.offline']()
          : m['connection.online']()}
      >
        {#if connectionStore.isOffline}
          <PlugZap class="h-5 w-5" />
        {:else}
          <Wifi class="h-5 w-5" />
        {/if}
      </Button>
    </Tooltip.Trigger>
    {#if connectionStore.isOffline}
      <Tooltip.Content>
        <span>
          {m['connection.offline']()}
          {#if connectionStore.isDevelopment}
            <span class="block text-xs text-muted-foreground">(Click to toggle)</span>
          {/if}
        </span>
      </Tooltip.Content>
    {/if}
  </Tooltip.Root>
{/if}
