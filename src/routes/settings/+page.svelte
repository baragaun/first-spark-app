<script lang="ts">
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import type { PageData } from './$types';
  import AccountSettings from './account/account-settings.svelte';
  import NotificationSettings from './notifications/notification-settings.svelte';

  let { data }: { data: PageData } = $props();

  let currentTab = $derived(data.currentTab);
  let myUser = $derived(myUserContext.myUser);
</script>

{#if currentTab === 'account'}
  <AccountSettings {data} {myUser} />
{:else if currentTab === 'notifications'}
  <NotificationSettings />
{/if}
