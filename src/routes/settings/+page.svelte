<script lang="ts">
  import type { PageData } from './$types';
  import AccountSettings from './account/+page.svelte';
  import NotificationSettings from './notifications/+page.svelte';

  let { data }: { data: PageData } = $props();
  let currentTab = $derived(data.currentTab);
</script>

{#if currentTab === 'account'}
  <AccountSettings {data} />
{:else if currentTab === 'notifications'}
  <NotificationSettings />
{/if}
