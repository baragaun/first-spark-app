<script lang="ts">
  import type { PageData } from './$types';
  import AccountSettings from './account-settings.svelte';

  let { data }: { data: PageData } = $props();
</script>

<AccountSettings {data} />
