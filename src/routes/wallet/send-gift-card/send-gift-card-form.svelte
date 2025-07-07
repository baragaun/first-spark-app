<script lang="ts">
  import { zod } from 'sveltekit-superforms/adapters';
  import { sendGiftCardSchema, type SendGiftCardSchema } from './schema';
  import { z } from 'zod';
  import IdentFormInput from '$lib/components/forms/form-ident-input.svelte';
  import { Input } from '$lib/components/ui/input';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { debounce } from 'throttle-debounce';
  import FormButton from '@/components/forms/form-button.svelte';
  import { onMount } from 'svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  import { m } from '@/paraglide/messages';

  const DEBOUNCE_DELAY = 350;

  let { data }: { data: { form: SuperValidated<SendGiftCardSchema> } } = $props();

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zod(sendGiftCardSchema),
    resetForm: false,
    validationMethod: 'submit-only',
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
    return $formData.senderName && $formData.senderEmail && $formData.message;
  });

  let showDialog = $state(false);

  const handleFormSubmit = async () => {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      formState.hasError = true;
      return;
    }
    showDialog = true;
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

  onMount(async () => {});
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
  <FormButton
    disabled={buttonState.isDisabled}
    isLoading={buttonState.isLoading}
    buttonText="Send Gift"
    loadingText="sending"
  />
</form>

<AlertDialog open={showDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Gift card sent!</AlertDialogTitle>
      <AlertDialogDescription>Your gift has been sent successfully.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction
        onclick={() => {
          showDialog = false;
        }}
      >
        {m['cart.okay']()}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
