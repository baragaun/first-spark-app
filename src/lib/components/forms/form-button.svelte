<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { LoaderCircle } from 'lucide-svelte';

  let {
    disabled = false,
    loading = false,
    buttonText = 'Submit',
    loadingText = 'Processing...',
    variant = 'default',
    fullWidth = true,
    type = 'submit',
    onClick = undefined,
  } = $props<{
    disabled?: boolean;
    loading?: boolean;
    buttonText?: string;
    loadingText?: string;
    variant?: string;
    fullWidth?: boolean;
    type?: string;
    onClick?: (() => void) | undefined;
  }>();
</script>

<Form.Button
  {variant}
  {disabled}
  {type}
  class={fullWidth ? 'w-full' : ''}
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
  {:else}
    {buttonText}
  {/if}
</Form.Button>
