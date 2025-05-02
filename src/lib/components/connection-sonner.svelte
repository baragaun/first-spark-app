<script lang="ts">
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { toast } from 'svelte-sonner';
  import { PlugZap, PartyPopper } from 'lucide-svelte';
  import { m } from '$lib/paraglide/messages.js';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';

  let isOffline = $derived(myUserContext.isOffline);
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
  } ;

  const reconnectedToast = () => {
    toast.dismiss('connection-offline');

    toast.success(m['connection.reconnected'](), {
      description: m['connection.reconnected.description'](),
      icon: PartyPopper,
      duration: 5000,
      id: 'connection-online',
    });
  } ;

  $effect(() => {
    // Do not toast when the client is already connected on mount
    if (initialLoad && !isOffline) {
      initialLoad = false;
      return;
    }
    
    if (isOffline) {
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
      myUserContext.isOffline = false;
    };
    
    const handleOffline = () => {
      myUserContext.isOffline = true;
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initialize status from browser until the node client does support this
    myUserContext.isOffline = !navigator.onLine;
    
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