<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import type { SuperForm } from "sveltekit-superforms";

  let { 
    form, 
    fieldName = "email", 
    placeholder = 'e.g. "student@example.com"',
    label = "Email address"
  } = $props<{
    form: SuperForm<any, any>;
    fieldName?: string;
    placeholder?: string;
    label?: string;
  }>();

  const formData = form.form;
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <Input
        {...props}
        bind:value={$formData[fieldName]}
        {placeholder}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>