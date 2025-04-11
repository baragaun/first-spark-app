<script lang="ts">
  import type { PageData } from './$types';
  import SignUpForm from './form/sign-up-form2.svelte';
  let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <SignUpForm {data} />
</div>
