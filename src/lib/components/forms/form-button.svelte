<script lang="ts">
  import * as Form from '$components/ui/form/index.js';
  import SpinLoadIndicator from './spin-load-indicator.svelte';

  let {
    disabled = false,
    isLoading = false,
    isSuccess = false,
    buttonText = 'Submit',
    loadingText = 'Processing...',
    successText = 'Success!',
    variant = 'default',
    fullWidth = true,
    type = 'submit',
    onClick = undefined,
    extraClass = '',
  } = $props<{
    disabled?: boolean;
    isLoading?: boolean;
    isSuccess?: boolean;
    buttonText?: string;
    loadingText?: string;
    successText?: string;
    variant?: string;
    fullWidth?: boolean;
    type?: string;
    onClick?: (() => void) | undefined;
    extraClass?: string;
  }>();
</script>

{#snippet icon()}
  <div class="mx-2">
    <SpinLoadIndicator {isLoading} {isSuccess} />
  </div>
{/snippet}

<Form.Button
  {variant}
  {disabled}
  {type}
  class={`${isSuccess ? 'bg-green-700' : ''} ${fullWidth ? 'w-full' : ''} ${extraClass}`}
  onclick={(e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  }}
>
  <div class="flex items-center justify-center">
    {#if isLoading}
      {loadingText}{@render icon()}
    {:else if isSuccess}
      {successText}{@render icon()}
    {:else}
      {buttonText}
    {/if}
  </div>
</Form.Button>
