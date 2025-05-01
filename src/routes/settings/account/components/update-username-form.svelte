<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import FormButton from '@/components/forms/form-button.svelte';
  import { Button } from '@/components/ui/button';
  import { usernameFormSchema, type UsernameFormSchema } from '../../(data)/schema';

  let { preValidatedForm, onClose }: {
    preValidatedForm: SuperValidated<UsernameFormSchema>,
      onClose?: (() => void)
  } = $props();

  let currentEmail = $derived(myUserContext.myEmail);
  let currentUsername = $derived(myUserContext.myUserHandle);

  let hasStepError = $state(true);
  let debounceTimer: number | null = null;
  let isLoading = $state(false);
  let isSuccess = $state(false);
  let identType = $state(UserIdentType.userHandle);
  const DEBOUNCE_DELAY = 350; // ms

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

  const debounceFormValidation = async () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    if (!$formData.username) return;

    debounceTimer = window.setTimeout(async () => {
      try {
        const result = await validateForm({ update: true, focusOnError: false });

        const availability = await checkUsernameAvailability();
        hasStepError = !availability || !result.valid;
      } catch (error) {
        console.error('Error debouncing the form input:', error);
      } finally {
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  const checkUsernameAvailability = async (): Promise<boolean> => {
    isLoading = true;

    if ($formData.username === myUserContext.myUserHandle) {
      isLoading = false;
      return true;
    }

    const validationResult = usernameFormSchema.safeParse($formData);
    if (!validationResult.success) {
      isLoading = false;
      return false;
    }

    const fieldName = 'username';
    const message = `This ${fieldName} is currently unavailable for use.`;

    try {
      const response = await myUserContext.isUserIdentAvailable($formData.username, identType);

      if (response.error) {
        updateFormErrors('username', response.error);
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
        return setTimeout(() => {
          onClose && onClose();
        }, 1000);
      }
    } finally {
      isLoading = false;
    }
  };

  $effect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

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
        Current username
      </label>
      <Input id="current-username" value={currentUsername} disabled class="bg-muted" />
    </div>
    <IdentFormInput
      {form}
      fieldName="username"
      placeholder="e.g. 'giraffe08'"
      label="New username"
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
      buttonText="Save"
      loadingText="Updating"
    />
    <Button variant="outline" onclick={onClose}>Cancel</Button>
  </div>
</form>
