<script lang="ts" module>
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Eye, EyeOff } from 'lucide-svelte';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';

  let {
    form,
    fieldName = 'password',
    placeholder = 'Your password must be at least 8 characters',
    label = 'Password',
  } = $props<{
    form: SuperForm<T>;
    fieldName?: FormPathLeaves<T>;
    placeholder?: string;
    label?: string;
  }>();

  const formData = form.form;
  const errors = form.errors;

  let showPassword = $state(false);
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <div class="relative">
        <Input
          {...props}
          bind:value={$formData[fieldName]}
          {placeholder}
          type={showPassword ? 'text' : 'password'}
          class={$errors[fieldName] ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onclick={() => (showPassword = !showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {#if showPassword}
            <Eye size={20} />
          {:else}
            <EyeOff size={20} />
          {/if}
        </button>
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
