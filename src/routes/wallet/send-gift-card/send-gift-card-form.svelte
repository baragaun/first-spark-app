<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { sendGiftSchema } from './schema';
  import { z } from 'zod';
  import IdentFormInput from '$lib/components/forms/form-ident-input.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { debounce } from 'throttle-debounce';
  import FormButton from '@/components/forms/form-button.svelte';
  import { onMount } from 'svelte';

  const DEBOUNCE_DELAY = 350;

  const form = superForm(zod(sendGiftSchema) as any, {
    dataType: 'json',
    resetForm: false,
    validationMethod: 'submit-only',
    validators: zod(sendGiftSchema),
    async onChange() {
      debouncedValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the server-side form action
      await handleFormSubmit();
    },
  });

  const { form: formData, errors, delayed, enhance, validateForm } = form;

  let formState = $state({
    isLoading: false,
    hasError: false,
  });

  const buttonState = $derived.by(() => ({
    isDisabled: !isFormValid || formState.isLoading || formState.hasError,
    isLoading: ($delayed || formState.isLoading) && !formState.hasError,
  }));

  const isFormValid = $derived.by(() => {
    console.log('jahanvi');
    console.log($formData.email);
    return $formData.email && $formData.username && $formData.message;
  });

  const handleFormSubmit = async () => {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      formState.hasError = true;
      return;
    }
    alert('Gift sent!');
  };

  const debouncedValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const result = await validateForm({ update: true, focusOnError: false });
      formState.hasError = !result.valid;
    } catch (error) {
      console.error('Error validating form:', error);
    } finally {
      formState.isLoading = false;
    }
  });

  onMount(async () => {
    $formData = {
      email: '',
      token: '',
      username: '',
      password: '',
    };
  });
</script>

<form
  method="POST"
  use:enhance
  onsubmit={handleFormSubmit}
  class="mx-auto max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-background"
>
  <IdentFormInput
    {form}
    fieldName="senderName"
    label="Sender Name"
    placeholder="Enter your name"
    identType={UserIdentType.userHandle}
  />
  <IdentFormInput
    {form}
    fieldName="senderEmail"
    label="Sender Email"
    placeholder="Enter your email"
    identType={UserIdentType.email}
  />
  <div>
    <label class="mb-1 block text-sm font-medium" for="message">Message</label>
    <Input
      id="message"
      type="text"
      bind:value={$formData.message}
      class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      placeholder="Write a message (optional)"
    />
    {#if $errors.message}
      <div class="mt-1 text-xs text-red-500">{$errors.message[0]}</div>
    {/if}
  </div>
  <span>{isFormValid}</span>
  <FormButton
    disabled={buttonState.isDisabled}
    isLoading={buttonState.isLoading}
    buttonText="Send Gift"
    loadingText="sending"
  />
</form>
