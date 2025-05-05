<script lang="ts">
  import { myUserContext } from '@contexts/my-user-context.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { type PageData } from './$types.js';
  import ResetPasswordForm from './reset-password-form.svelte';

  let { data }: { data: PageData } = $props();
  const isSignedIn = $derived(myUserContext.isSignedIn);

  onMount(async () => {
    if (isSignedIn) await goto('/');
  });
</script>

<div class="flex h-full w-full items-center justify-center px-4">
  <div class="w-full max-w-md">
    <ResetPasswordForm {data} />
  </div>
</div>
