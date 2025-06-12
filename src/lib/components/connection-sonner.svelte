<script lang="ts">
  import { Toaster } from '$lib/components/ui/sonner';
  import { toast } from 'svelte-sonner';
  import { PlugZap, PartyPopper } from 'lucide-svelte';
  import { m } from '$lib/paraglide/messages.js';
  import { onMount } from 'svelte';
  import { appTitle } from '@/stores/app-store';

  let { clientConnection } = $props();
  let hasDisconnected = $state(false);
  let initialLoad = $state(true);

  const disconnectedToast = () => {
    toast.dismiss('connection-online');

    toast.warning(m['connection.offline'](), {
      description: m['connection.offline.description'](),
      icon: PlugZap,
      duration: Infinity,
      id: 'connection-offline',
    });
  };

  const reconnectedToast = () => {
    toast.dismiss('connection-offline');

    toast.success(m['connection.reconnected'](), {
      description: m['connection.reconnected.description']({ title: $appTitle }),
      icon: PartyPopper,
      duration: 5000,
      id: 'connection-online',
    });
  };

  $effect(() => {
    // Do not toast when the client is already connected on mount
    if (initialLoad && !clientConnection) {
      initialLoad = false;
      return;
    }

    if (clientConnection) {
      // Only toast when a disconnection happens after the initial load
      if (!initialLoad) {
        hasDisconnected = true;
      }
      disconnectedToast();
    } else if (hasDisconnected) {
      // Only toast if we have restored our previously disconnected state
      reconnectedToast();
    }

    // Always update initialLoad after first run
    initialLoad = false;
  });

  // Listen to browser's online/offline events
  onMount(() => {
    const handleOnline = () => {
      clientConnection = false;
    };

    const handleOffline = () => {
      clientConnection = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize status from browser until the node client does support this
    clientConnection = !navigator.onLine;

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });
</script>

<Toaster
  richColors
  closeButton
  position="bottom-right"
  toastOptions={{
    classes: {
      toast: 'mb-[5rem]',
      title: 'ml-2',
      description: 'ml-2',
    },
  }}
/>
