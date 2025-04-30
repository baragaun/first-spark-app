<script lang="ts">
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import AccountSettingsMenu from './account/components/account-settings-menu.svelte';
  import NotificationSettingsMenu from './notifications/notification-settings-menu.svelte';

  let { data }: { data: PageData } = $props();
  const isSignedIn = $derived(myUserContext.isSignedIn);

  // Determine which tab to show based on the URL
  let activeTab = $derived.by(() => {
    const path = page.url.pathname;
    if (path === '/settings/notifications') return 'notifications';
    return 'account'; // Default to account tab
  });

  onMount(() => {
    if (!isSignedIn) {
      goto('/signin', { replaceState: true });
    }
  });
</script>

<div class="space-y-6">
  {#if activeTab === 'account'}
    <AccountSettingsMenu {data} />
  {:else if activeTab === 'notifications'}
    <NotificationSettingsMenu />
  {/if}
</div>
