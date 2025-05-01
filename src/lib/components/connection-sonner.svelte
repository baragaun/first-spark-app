<script lang="ts">
  import { onMount } from 'svelte';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { toast } from 'svelte-sonner';
  import { PlugZap, PartyPopper } from 'lucide-svelte';
  import { m } from '$lib/paraglide/messages.js';

  let isOffline = $state(false);
  let previousOfflineState = $state(false);
  let offlineToastId: string | number | undefined;

  // Subscribe to connection status changes
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

  onMount(() => {
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
</script>

<Toaster richColors closeButton />
