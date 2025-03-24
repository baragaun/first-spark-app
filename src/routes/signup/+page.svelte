<script lang="ts">
  import type { PageData } from './$types';
  import SignUpForm from './form/sign-up-form.svelte';
  let { data }: { data: PageData } = $props();
</script>

<!-- <div class="relative mx-auto flex h-screen items-center justify-center"> -->
<div class="flex h-screen w-full items-center justify-center px-4">
  <SignUpForm {data} />
</div>
