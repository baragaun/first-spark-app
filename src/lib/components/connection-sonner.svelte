<script lang="ts">
  import { onMount } from 'svelte';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { toast } from 'svelte-sonner';
  import { PlugZap, PartyPopper } from 'lucide-svelte';
  import { m } from '$lib/paraglide/messages.js';
  import { connectionStore } from '@/stores/connection-store.svelte';

  let lastOfflineState = $state(connectionStore.isOffline);

  // Subscribe to connection status changes
  $effect(() => {
    const isOffline = connectionStore.isOffline;

    if (isOffline && !lastOfflineState) {
      // Connection lost
      showOfflineSonner();
    } else if (!isOffline && lastOfflineState) {
      // Connection restored
      if (connectionStore.offlineToastId) {
        toast.dismiss(connectionStore.offlineToastId);
      }

      toast.success(m['connection.reconnected'](), {
        description: m['connection.reconnected.description'](),
        icon: PartyPopper,
        duration: 5000, // Close after 5 seconds
        id: 'connection-reconnected',
      });
    }

    // Update our local tracking state
    lastOfflineState = isOffline;

    // Update the store's previous state
    connectionStore.updatePreviousState();
  });

  onMount(() => {
    // Check connection status on mount
    if (connectionStore.isOffline) {
      showOfflineSonner();
    }
  });

  function showOfflineSonner() {
    connectionStore.offlineToastId = toast.error(m['connection.offline'](), {
      description: m['connection.offline.description'](),
      icon: PlugZap,
      duration: Infinity,
      id: 'connection-offline',
    });
  }
</script>

<Toaster
  richColors
  closeButton
  position="bottom-right"
  toastOptions={{
    classes: {
      toast: 'connection-toast',
      title: 'connection-toast-title',
      description: 'connection-toast-description',
    },
  }}
/>

<style>
  :global(.connection-toaster) {
    bottom: 4rem !important; /* Adjust this value based on your footer height */
  }

  :global(.connection-toast) {
    margin-bottom: 4rem;
  }

  :global(.connection-toast-title) {
    margin-left: 0.5rem;
  }

  :global(.connection-toast-description) {
    margin-left: 0.5rem;
  }
</style>
