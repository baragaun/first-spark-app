<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import passwordHelpers from '$lib/helpers/password-helpers';
  import { cn } from '$lib/utils.js';
  import Eye from 'lucide-svelte/icons/eye';
  import EyeOff from 'lucide-svelte/icons/eye-off';
  import { type SuperForm } from 'sveltekit-superforms/client';

  const { validatePassword, getPasswordError } = passwordHelpers;

  let {
    form,
    fieldName = 'password',
    label = 'Password',
    showValidation = false,
    placeholder = 'Password',
    errorMessage = '',
    isValid = false,
    ...restProps
  } = $props<{
    form: SuperForm<any, any>;
    fieldName?: string;
    label?: string;
    showValidation?: boolean;
    isValid?: boolean;
    placeholder?: string;
    errorMessage?: string;
  }>();

  const { form: formData, errors } = form;

  let showPassword = $state(false);

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };

  // Update isValid whenever value changes
  // $effect(() => {
  //   if (!$formData[fieldName] && !errorMessage && !$errors[fieldName]) {
  //     isValid = false;
  //     return;
  //   }
  //   isValid = validatePassword($formData[fieldName]).isValid;
  // });
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Form.Label
            class={cn(
              'text-sm font-medium',
              $formData[fieldName] && errorMessage ? 'text-destructive' : '',
            )}>{label}</Form.Label
          >
        </div>
        <div class="relative w-full">
          <Input
            {...props}
            id={fieldName}
            type={showPassword ? 'text' : 'password'}
            {placeholder}
            class={cn('pr-10')}
            bind:value={$formData[fieldName]}
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

        {#if showValidation && $formData[fieldName]}
          {@const passwordValidation = validatePassword($formData[fieldName])}
          <div class="space-y-2 text-xs">
            <p class="text-muted-foreground">Password requirements:</p>
            <ul class="list-inside list-disc space-y-1 pl-2">
              <li
                class:text-destructive={$formData[fieldName].length < 8}
                class:text-green-500={$formData[fieldName].length >= 8}
              >
                At least 8 characters
              </li>
            </ul>
          </div>

          {#if getPasswordError($formData[fieldName])}
            <p class="text-xs text-destructive">{getPasswordError($formData[fieldName])}</p>
          {/if}
        {/if}
      </div>
    {/snippet}
  </Form.Control>

  <div class="mt-2">
    {#if $errors[fieldName]}
      <Form.FieldErrors class="text-xs text-destructive" />
    {:else if errorMessage}
      <p class="text-xs text-destructive">{errorMessage}</p>
    {/if}
  </div>
</Form.Field>
