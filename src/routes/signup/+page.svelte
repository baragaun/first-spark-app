<script lang="ts">
  import type { PageData } from './$types';
  import SignUpForm from './sign-up-form.svelte';
  let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full items-center justify-center px-4 py-8">
  <div class="w-full max-w-sm animate-fade-in">
    <SignUpForm {data} />
  </div>
</div>
