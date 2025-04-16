<script lang="ts" module>
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';

  let {
    form,
    fieldName = 'email',
    placeholder = 'e.g. "student@example.com"',
    label = 'Email address',
    disabled = false,
  } = $props<{
    form: SuperForm<T>;
    fieldName?: FormPathLeaves<T>;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
  }>();

  const formData = form.form;
  const errors = form.errors;
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <Input
        {...props}
        bind:value={$formData[fieldName]}
        class={$errors[fieldName] ? 'border-red-500 focus-visible:ring-red-500' : ''}
        {placeholder}
        {disabled}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
