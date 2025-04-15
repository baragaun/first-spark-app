<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { SuperForm } from 'sveltekit-superforms';

  let {
    form,
    fieldName = 'email',
    placeholder = 'e.g. "student@example.com"',
    label = 'Email address',
    disabled = false,
  } = $props<{
    form: SuperForm<any, any>;
    fieldName?: string;
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
