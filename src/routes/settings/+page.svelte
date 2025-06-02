<script lang="ts">
  import type { PageData } from './$types';
  import AccountSettings from './account/account-settings.svelte';
  import NotificationSettings from './notifications/notification-settings.svelte';

  let { data }: { data: PageData } = $props();
  let currentTab = $derived(data.currentTab);
</script>

{#if currentTab === 'account'}
  <AccountSettings {data} />
{:else if currentTab === 'notifications'}
  <NotificationSettings />
{/if}
