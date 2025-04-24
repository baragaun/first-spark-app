<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Check, LoaderCircle } from 'lucide-svelte';

  let {
    disabled = false,
    loading = false,
    success = false,
    buttonText = 'Submit',
    loadingText = 'Processing...',
    variant = 'default',
    fullWidth = true,
    type = 'submit',
    onClick = undefined,
    extraClass = '',
  } = $props<{
    disabled?: boolean;
    loading?: boolean;
    success?: boolean;
    buttonText?: string;
    loadingText?: string;
    variant?: string;
    fullWidth?: boolean;
    type?: string;
    onClick?: (() => void) | undefined;
    extraClass?: string;
  }>();
</script>

<Form.Button
  {variant}
  {disabled}
  {type}
  class={`${fullWidth ? 'w-full' : ''} ${extraClass}`}
  onclick={(e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  }}
>
  {#if loading}
    <LoaderCircle class="mr-2 animate-spin" />
    {loadingText}
  {:else if success}
    <Check class="mr-2 h-4 w-4" />
    {buttonText}
  {:else}
    {buttonText}
  {/if}
</Form.Button>
