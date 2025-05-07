<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Alert from '$lib/components/ui/alert';
  import * as Form from '$lib/components/ui/form/index';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import FormButton from '@/components/forms/form-button.svelte';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import { Button } from '@/components/ui/button';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { m } from '@/paraglide/messages';
  import { AppUiMessage } from '@/types/enums';
  import { AlertTriangle } from 'lucide-svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { deleteAccountFormSchema, type DeleteAccountFormSchema } from '../../(data)/schema';

  let {
    preValidatedForm,
    onClose,
  }: {
    preValidatedForm: SuperValidated<DeleteAccountFormSchema>;
    onClose?: () => void;
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
        if (result.valid && $formData.confirmEmail !== currentEmail) {
          hasStepError = true;
          updateFormErrors('confirmEmail', m['setting.delete_account.error.incorrect']());
        }
      } catch (error) {
        console.error('Error validating form input:', error);
      } finally {
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  const deleteMyAccount = async () => {
    try {
      isLoading = true;

      const response = await myUserContext.deleteMyUser($formData.reason, $formData.description);

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
        goto('/');
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
      <Alert.Title>{m['setting.delete_account.alert_title']()}</Alert.Title>
      <Alert.Description>
        {m['setting.delete_account.alert_subtitle']()}
      </Alert.Description>
    </Alert.Root>

    <!-- TODO: This needs to be a Select with standard reasons -->
    <Form.Field {form} name="reason">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>{m['setting.delete_account.reason']()}</Form.Label>
          <Input
            {...props}
            id="reason"
            type="text"
            placeholder={m['setting.delete_account.reason_placeholder']()}
            bind:value={$formData.reason}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="description">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>{m['setting.delete_account.addition_details']()}</Form.Label>
          <Textarea
            {...props}
            id="description"
            placeholder={m['setting.delete_account.addition_details_placeholder']()}
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
      label={m['setting.delete_account.confirm_email']()}
      placeholder={currentEmail || ''}
    />
  </div>
  <FormButton
    variant="destructive"
    disabled={isLoading || $delayed || hasStepError}
    {isLoading}
    {isSuccess}
    buttonText={m['setting.buttons.delete_account']()}
    loadingText={m['setting.buttons.cleaning']()}
    successText={m['setting.buttons.goodbuy']()}
  />
  <Button variant="outline" onclick={onClose}>{m['setting.buttons.cancel']()}</Button>
</form>
