<script lang="ts">
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import AccountSettingsMenu from './account/components/account-settings-menu.svelte';

  let { data }: { data: PageData } = $props();
  const isSignedIn = $derived(myUserContext.isSignedIn);

  onMount(() => {
    if (!isSignedIn) {
      goto('/signin', { replaceState: true });
    }
  });
</script>

<div class="space-y-6">
  <AccountSettingsMenu {data} />
</div>
