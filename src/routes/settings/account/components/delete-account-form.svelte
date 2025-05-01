<script lang="ts">
  import * as Alert from '$lib/components/ui/alert';
  import * as Form from '$lib/components/ui/form/index';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { AlertTriangle } from 'lucide-svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import FormButton from '@/components/forms/form-button.svelte';
  import { Button } from '@/components/ui/button';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage } from '@/types/enums';
  import { deleteAccountFormSchema, type DeleteAccountFormSchema } from '../../(data)/schema';

  let { preValidatedForm, onClose }: {
    preValidatedForm: SuperValidated<DeleteAccountFormSchema>,
      onClose?: (() => void)
  } = $props();

  let currentEmail = $derived(myUserContext.myEmail);
  let isLoading = $state(false);
  let isSuccess = $state(false);
  let hasStepError = $state(true);
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 500;

  const form = superForm(preValidatedForm, {
    validators: zodClient(deleteAccountFormSchema),
    validationMethod: 'submit-only',
    dataType: 'json',
    resetForm: true,
    async onChange() {
      await debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      await deleteMyAccount();
    },
  });

  const { form: formData, delayed, enhance, errors, validateForm } = form;

  const updateFormErrors = (field: keyof DeleteAccountFormSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const debounceFormValidation = async () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    if (!$formData.confirmEmail) return;

    debounceTimer = window.setTimeout(async () => {
      try {
        const result = await validateForm({ update: true, focusOnError: true });
        hasStepError = !result.valid;
      } catch (error) {
        console.error('Error validating form input:', error);
      } finally {
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  const deleteMyAccount = async () => {
    const validationResult = await validateForm({ update: true, focusOnError: true });
    if (!validationResult.valid || $formData.confirmEmail !== currentEmail) return;

    try {
      isLoading = true;

      const response = await myUserContext.deleteMyUser(
        $formData.reason,
        $formData.description,
        true, // deletePhysically
      );

      if (response !== true) {
        console.error('DeleteAccountForm.deleteMyAccount: error deleting user account:', {
          result: response,
        });
        updateFormErrors('confirmEmail', 'Failed to delete account');
        return;
      }

      isSuccess = true;
      // Show success state briefly before closing
      setTimeout(() => {
        return onClose && onClose();
      }, 1000);
    } catch (error) {
      console.error('Error deleting account:', error);
      updateFormErrors('confirmEmail', translate(AppUiMessage.systemError));
      return;
    } finally {
      isLoading = false;
    }
  };
</script>

<form method="POST" use:enhance class="flex flex-1 flex-col space-y-8 overflow-hidden px-2">
  <div class="space-y-4">
    <Alert.Root variant="destructive" class="mb-4">
      <AlertTriangle class="h-4 w-4" />
      <Alert.Title>Are you sure you want to proceed?</Alert.Title>
      <Alert.Description>
        Your profile and all of your data will be permanently deleted. This action cannot be
        recovered from.
      </Alert.Description>
    </Alert.Root>

    <!-- TODO: This needs to be a Select with standard reasons -->
    <Form.Field {form} name="reason">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Reason</Form.Label>
          <Input
            {...props}
            id="reason"
            type="text"
            placeholder="Why are you deleting your account?"
            bind:value={$formData.reason}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="description">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Additional details</Form.Label>
          <Textarea
            {...props}
            id="description"
            placeholder="Do you have any additional feedback?"
            bind:value={$formData.description}
            rows={3}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <IdentFormInput
      {form}
      fieldName="confirmEmail"
      label="Confirm your email"
      placeholder={currentEmail || ''}
    />
  </div>
  <FormButton
    variant="destructive"
    disabled={isLoading || $delayed || hasStepError}
    {isLoading}
    {isSuccess}
    buttonText="Delete my account"
    loadingText="Cleaning up..."
    successText="Goodbye!"
  />
  <Button variant="outline" onclick={onClose}>Cancel</Button>
</form>
