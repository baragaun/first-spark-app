<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { m } from '$lib/paraglide/messages';
  import FormButton from '@/components/forms/form-button.svelte';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import { Button } from '@/components/ui/button';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { usernameFormSchema, type UsernameFormSchema } from '../../(data)/schema';
  import { debounce } from 'throttle-debounce';
  import { onDestroy } from 'svelte';

  let {
    preValidatedForm,
    onClose,
  }: {
    preValidatedForm: SuperValidated<UsernameFormSchema>;
    onClose?: () => void;
  } = $props();

  let currentEmail = $derived(myUserContext.myEmail);
  let currentUsername = $derived(myUserContext.myUserHandle);

  let hasStepError = $state(true);
  let isLoading = $state(false);
  let isSuccess = $state(false);
  let identType = $state(UserIdentType.userHandle);
  const DEBOUNCE_DELAY = 350; // ms

  const debounceFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      if (!$formData.username) return;

      const result = await validateForm({ update: true, focusOnError: false });

      const availability = await checkUsernameAvailability();
      hasStepError = !availability || !result.valid;
    } catch (error) {
      console.error('Error debouncing the form input:', error);
    }
  });

  const form = superForm(preValidatedForm, {
    validators: zod(usernameFormSchema),
    resetForm: true,
    dataType: 'json',
    validationMethod: 'submit-only',
    async onChange() {
      await debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the server-side form action
      await saveUsername();
    },
  });

  const { form: formData, delayed, enhance, errors, validateForm } = form;

  const updateFormErrors = (field: keyof UsernameFormSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const checkUsernameAvailability = async (): Promise<boolean> => {
    isLoading = true;
    const fieldName = 'username';

    if ($formData.username === myUserContext.myUserHandle) {
      // isLoading = false;
      // return true;
      isLoading = false;
      updateFormErrors(fieldName, m['setting.username.error.in_use']());
      return false;
    }

    const validationResult = usernameFormSchema.safeParse($formData);
    if (!validationResult.success) {
      isLoading = false;
      return false;
    }

    let message = m['setting.username.error.unavailable']();

    try {
      const response = await myUserContext.isUserIdentAvailable($formData.username, identType);

      if (response.error) {
        updateFormErrors(fieldName, response.error);
        return false;
      }

      if (!response.isAvailable) {
        updateFormErrors(fieldName, message);
        return false;
      }

      return response.isAvailable;
    } catch (error) {
      console.error('UpdateEmailDialog.checkIdentAvailability:', { error });
      updateFormErrors(fieldName, translate(AppUiMessage.systemError));
      return false;
    } finally {
      isLoading = false;
    }
  };

  const getSuggestedUsername = async () => {
    if (!currentEmail) return;

    try {
      const result = await myUserContext.findAvailableUserHandle(currentEmail);
      if (result && typeof result === 'object' && 'object' in result) {
        $formData.username = result.object ?? '';
      } else if (typeof result === 'string') {
        $formData.username = result;
      }
    } catch (error) {
      console.error('Error getting suggested handle:', error);
      updateFormErrors(
        'username',
        error instanceof Error ? error.message : 'Failed to find handle',
      );
    }
  };

  const handleUsernameChange = async (): Promise<boolean> => {
    try {
      isLoading = true;

      const result = await myUserContext.updateMyUser({
        userHandle: $formData.username,
      });

      if (result.error) {
        updateFormErrors('username', result.error);

        return false;
      }
      return true;
    } catch (error) {
      updateFormErrors(
        'username',
        error instanceof Error ? error.message : 'Failed to find handle',
      );

      console.error('Error updating username:', error);
      return false;
    }
  };

  const saveUsername = async () => {
    try {
      isLoading = true;
      const success = await handleUsernameChange();
      if (success) {
        isSuccess = true;
        // Show success state briefly before closing
        setTimeout(() => {
          return onClose && onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving username:', error);
      updateFormErrors(
        'username',
        error instanceof Error ? error.message : 'Failed to save username',
      );
    } finally {
      isLoading = false;
    }
  };

  onDestroy(() => {
    debounceFormValidation.cancel();
  });

  $effect(() => {
    if (!$formData) {
      isLoading = false;
      return;
    }
  });
</script>

<form method="POST" use:enhance class="flex flex-1 flex-col space-y-8 overflow-hidden px-2">
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="current-username" class="text-sm font-medium leading-none">
        {m['setting.username.current_username']()}
      </label>
      <Input id="current-username" value={currentUsername} disabled class="bg-muted" />
    </div>
    <IdentFormInput
      {form}
      fieldName="username"
      placeholder={m['setting.username.username_placeholder']()}
      label={m['setting.username.new_username']()}
      {identType}
      {isLoading}
      suggestUsername={getSuggestedUsername}
    />
  </div>
  <div class="flex flex-col space-y-2">
    <FormButton
      disabled={isLoading || $delayed || hasStepError}
      {isLoading}
      {isSuccess}
      buttonText={m['setting.buttons.update']()}
      loadingText={m['setting.buttons.updating']()}
    />
    <Button variant="outline" onclick={onClose}>{m['setting.buttons.cancel']()}</Button>
  </div>
</form>
