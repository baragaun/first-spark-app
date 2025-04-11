<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { SuperForm } from 'sveltekit-superforms';

  let {
    form,
    fieldName = 'newPassword',
    placeholder = 'Your password must be at least 8 characters',
    label = 'Password',
    type = 'password',
  } = $props<{
    form: SuperForm<any, any>;
    fieldName?: string;
    placeholder?: string;
    label?: string;
    type?: string;
  }>();

  const formData = form.form;
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <Input {...props} bind:value={$formData[fieldName]} {placeholder} {type} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
