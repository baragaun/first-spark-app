<script lang="ts">
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import type { PageData } from './$types';
  import AccountSettings from './account-settings.svelte';

  let myUser = $derived(myUserContext.myUser);
  let { data }: { data: PageData } = $props();
</script>

<AccountSettings {data} {myUser} />
