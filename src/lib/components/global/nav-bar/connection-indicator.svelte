<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { PlugZap, Wifi, PartyPopper } from 'lucide-svelte';
  import { m } from '$lib/paraglide/messages.js';
  import { onMount, onDestroy } from 'svelte';
  import { toast } from 'svelte-sonner';

  let isOffline = $state(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  let previousOfflineState = $state(false);
  let offlineToastId: string | number | undefined;
  const isDevelopment = $derived(import.meta.env.DEV);

  // Track connection status changes and show toast notifications
  $effect(() => {
    if (isOffline && !previousOfflineState) {
      // Connection lost
      offlineToastId = toast.error(m['connection.offline'](), {
        description: m['connection.offline.description'](),
        icon: PlugZap,
        duration: Infinity, // Keep showing until reconnected
        id: 'connection-offline',
      });
    } else if (!isOffline && previousOfflineState) {
      // Connection restored
      if (offlineToastId) {
        toast.dismiss(offlineToastId);
      }

      toast.success(m['connection.reconnected'](), {
        description: m['connection.reconnected.description'](),
        icon: PartyPopper,
        duration: 5000, // Close after 5 seconds
        id: 'connection-reconnected',
      });
    }

    previousOfflineState = isOffline;
  });

  function handleOnline() {
    isOffline = false;
  }

  function handleOffline() {
    isOffline = true;
  }

  function toggleConnection() {
    if (isDevelopment) {
      isOffline = !isOffline;
    }
  }

  onMount(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection status on mount
    if (isOffline) {
      offlineToastId = toast.error(m['connection.offline'](), {
        description: m['connection.offline.description'](),
        icon: PlugZap,
        duration: Infinity,
        id: 'connection-offline',
      });
    }
  });

  onDestroy(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });
</script>

{#if isOffline || isDevelopment}
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <Button
          variant="ghost"
          size="icon"
          class="h-9 w-9 {isOffline ? 'text-destructive' : ''}"
          disabled={!isDevelopment}
          onclick={toggleConnection}
          aria-label={isOffline ? m['connection.offline']() : m['connection.online']()}
        >
          {#if isOffline}
            <PlugZap class="h-5 w-5" />
          {:else}
            <Wifi class="h-5 w-5" />
          {/if}
        </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      {isOffline ? m['connection.offline']() : m['connection.online']()}
    </Tooltip.Content>
  </Tooltip.Root>
{/if}
