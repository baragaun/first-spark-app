<script lang="ts">
  import type { PageData } from './$types';
  import AccountSettingsMenu from './components/account-settings-menu.svelte';

  let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6">
  <AccountSettingsMenu {data} />
</div>
