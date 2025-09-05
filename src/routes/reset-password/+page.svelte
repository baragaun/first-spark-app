<script lang="ts">
  import { goto } from '$app/navigation';
  import { MyUserContext } from '@/contexts/my-user-context.svelte.js';
  import { getContext } from 'svelte';
  import { type PageData } from './$types.js';
  import ResetPasswordForm from './reset-password-form.svelte';

  let { data }: { data: PageData } = $props();

  const userContext = getContext<MyUserContext>('myUserContext');
  const isOffline: boolean = $derived(userContext.isOffline);
  const isSignedIn = $derived(userContext.isSignedIn);

  $effect(() => {
    if (isSignedIn) goto('/');
  });
</script>

<div class="flex h-full w-full items-center justify-center px-4">
  <div class="w-full max-w-md">
    <ResetPasswordForm {data} />
  </div>
</div>
