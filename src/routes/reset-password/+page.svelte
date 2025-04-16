<script lang="ts">
  import { type PageData } from './$types.js';
  import ResetPasswordForm from './reset-password-form.svelte';

  let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full items-center justify-center p-4">
  <div class="w-full max-w-md">
    <ResetPasswordForm {data} />
  </div>
</div>
