<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import type { ComponentProps } from 'svelte';
  import { cn } from '$lib/utils.js';
  import Eye from 'lucide-svelte/icons/eye';
  import EyeOff from 'lucide-svelte/icons/eye-off';
  import passwordHelpers from '$lib/helpers/password-helpers';

  const { validatePassword, getPasswordError } = passwordHelpers;

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className,
    placeholder = 'Password',
    showValidation = false,
    isValid = $bindable(false),
    ...restProps
  }: ComponentProps<typeof Input> & { 
    showValidation?: boolean;
    isValid?: boolean;
  } = $props();

  let showPassword = $state(false);

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };
  
  // Update isValid whenever value changes
  $effect(() => {
    if (!value) {
      isValid = false;
      return;
    }
    isValid = validatePassword(value).isValid;
  });
</script>

<div class="space-y-2">
  <div class="relative w-full">
    <Input
      bind:ref
      bind:value
      type={showPassword ? 'text' : 'password'}
      {placeholder}
      class={cn('pr-10', className)}
      {...restProps}
    />
    <button
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      onclick={togglePasswordVisibility}
      tabindex="-1"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {#if showPassword}
        <Eye size={20} />
      {:else}
        <EyeOff size={20} />
      {/if}
    </button>
  </div>

  {#if showValidation && value}
    {@const passwordValidation = validatePassword(value)}
    <div class="space-y-2 text-xs">
      <p class="text-muted-foreground">Password requirements:</p>
      <ul class="list-inside list-disc space-y-1 pl-2">
        <li
          class:text-destructive={value.length < 8}
          class:text-green-500={value.length >= 8}
        >
          At least 8 characters
        </li>
      </ul>
    </div>

    {#if getPasswordError(value)}
      <p class="text-xs text-destructive">{getPasswordError(value)}</p>
    {/if}
  {/if}
</div>

