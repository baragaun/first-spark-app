<script lang="ts">
  import type { PageData } from './$types';
  import AccountSettingsForm from './components/account-settings-menu.svelte';
  import { accountSettingsSchema, type AccountSettingsSchema } from './account-settings-schema';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

  let { data }: { data: PageData } = $props();
  //let { data }: { data: { form: SuperValidated<Infer<AccountSettingsSchema>> } } = $props();
</script>

<div class="space-y-6">
  <AccountSettingsForm {data} />
</div>
