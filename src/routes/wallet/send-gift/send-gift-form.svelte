<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { sendGiftSchema } from './schema';
  import IdentFormInput from '$lib/components/forms/form-ident-input.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';

  const form = superForm(zod(sendGiftSchema), {
    dataType: 'json',
    resetForm: false,
    validationMethod: 'submit-only',
  });

  const { form: formData, errors, enhance, validateForm } = form;

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) return;
    // Handle send gift logic here
    alert('Gift sent!');
  }
</script>

<form use:enhance on:submit={handleSubmit} class="space-y-4 max-w-md mx-auto bg-white dark:bg-background p-6 rounded-xl shadow">
  <IdentFormInput
    form={form}
    fieldName="senderName"
    label="Sender Name"
    placeholder="Enter your name"
  />
  <IdentFormInput
    form={form}
    fieldName="senderEmail"
    label="Sender Email"
    placeholder="Enter your email"
  />
  <div>
    <label class="block text-sm font-medium mb-1" for="message">Message</label>
    <Input
      id="message"
      type="text"
      bind:value={$formData.message}
      class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      placeholder="Write a message (optional)"
    />
    {#if $errors.message}
      <div class="text-red-500 text-xs mt-1">{$errors.message[0]}</div>
    {/if}
  </div>
  <Button type="submit" class="w-full">Send Gift</Button>
</form>
