<script lang="ts">
  import type { PageData } from './$types';
  import SignUpForm from './form/sign-up-form.svelte';
  let { data }: { data: PageData } = $props();
</script>

<div class="flex items-center justify-center px-4 py-40">
  <SignUpForm {data} />
</div>
