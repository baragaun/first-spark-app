<script lang="ts">
  import type { PageData } from './$types';
  import SignUpForm from './sign-up-form.svelte';
  let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full items-center justify-center px-4">
  <div class="w-full max-w-md">
    <SignUpForm {data} />
  </div>
</div>
