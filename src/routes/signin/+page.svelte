<script lang="ts">
  import { type PageData } from './$types.js';
  import SignInForm from './sign-in-form.svelte';

  let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full items-center justify-center px-4">
  <div class="w-full max-w-md">
    <SignInForm {data} />
  </div>
</div>
