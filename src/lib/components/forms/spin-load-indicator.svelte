<script lang="ts">
  import { LoaderCircle, CircleCheckBig } from 'lucide-svelte';

  let { isLoading = $bindable(true), isSuccess = $bindable(false) } = $props<{
    isLoading?: boolean;
    isSuccess?: boolean;
  }>();
</script>

<div class="m-auto flex h-6 w-6 items-center justify-center">
  {#if isSuccess}
    <CircleCheckBig style="animation: show-checkmark 0.3s ease-out forwards;" />
  {:else if isLoading}
    <LoaderCircle class="animate-spin" />
  {:else}
    <div hidden></div>
  {/if}
</div>

<style>
  @keyframes show-checkmark {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    70% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
