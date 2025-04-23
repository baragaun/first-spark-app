<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import { ChevronRight } from 'lucide-svelte';

  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { usernameSchema, type UsernameSchema } from '../schema';
  import UpdateDialog from './update-dialog-template.svelte';

  interface UpdateUsernameDialogProps {
    currentUsername: string;
    currentEmail: string;
    usernameForm: SuperValidated<UsernameSchema>;
  }

  let { currentUsername, currentEmail, usernameForm }: UpdateUsernameDialogProps = $props();

  const form = superForm(usernameForm, {
    validators: zod(usernameSchema),
    resetForm: true,
    dataType: 'json',
    validationMethod: 'submit-only',
    async onChange() {
      debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the server-side form action
      await saveUsername();
      resetDialogState();
    },
  });

  const { form: formData, errors, validateForm } = form;
  
  const updateFormErrors = (field: keyof UsernameSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  let isInvalidFormOrUsernameUnavailable = $state(false);
  let debounceTimer: number | null = null;
  let isLoading = $state(false);
  let showDialog = $state(false);
  let identType = $state(UserIdentType.userHandle);
  let step = $state(1);
  const DEBOUNCE_DELAY = 350; // ms

  let hasFormValues = $derived(
    $formData.username &&
      !$errors.username &&
      !isInvalidFormOrUsernameUnavailable &&
      $formData.username !== currentUsername,
  );

  const debounceFormValidation = async () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (!$formData.username) return;

    debounceTimer = window.setTimeout(async () => {
      try {
        // Validate the username
        isLoading = true;
        const result = await validateForm({ update: true, focusOnError: false });

        const availability = await checkUsernameAvailability();
        isInvalidFormOrUsernameUnavailable = !availability || !result.valid;
      } catch (error) {
        console.error('Error debouncing the form input:', error);
      } finally {
        isLoading = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  const checkUsernameAvailability = async (): Promise<boolean> => {
    isLoading = true;

    if ($formData.username === myUserContext.myUserHandle) {
      return true;
    }

    const validationResult = usernameSchema.safeParse($formData);
    if (!validationResult.success) {
      return false;
    }

    const fieldName = 'username';
    const message = `This ${fieldName} is currently unavailable for use.`;

    try {
      const response = await myUserContext.isUserIdentAvailable($formData.username, identType);
      console.log('checkIdentAvailability: response:', { response });

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
      isLoading = true;
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
    } finally {
      isLoading = false;
    }
  };

  const handleUsernameChange = async (): Promise<boolean> => {
    try {
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

  function resetDialogState() {
    showDialog = false;
    step = 1;
    form.reset();
  }

  const saveUsername = async () => {
    try {
      isLoading = true;
      const success = await handleUsernameChange();
      if (success) {
        step = 2;
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

  const getDialogDetails = () => {
    switch (step) {
      case 1:
        return {
          title: 'Change Username',
          description: 'Enter a new username for your account or use our suggestion.',
          showActionButton: true,
          shouldEnableSave: hasFormValues,
          cancelButtonlabel: undefined,
          actionButtonloadingText: 'Saving ...',
        };
      default:
        return {
          title: 'Username updated',
          description: `Your Username has been successfully changed to ${$formData.username}.`,
          showActionButton: false,
          shouldEnableSave: undefined,
          cancelButtonlabel: 'Close',
          actionButtonloadingText: undefined,
        };
    }
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => (showDialog = true)}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Username</p>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
      {currentUsername}
    </p>
    <ChevronRight
      class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </div>
</button>

{#key showDialog}
  {@const dialogDetails = getDialogDetails()}
  <UpdateDialog
    title={dialogDetails.title}
    description={dialogDetails.description}
    {form}
    shouldEnableSave={dialogDetails.shouldEnableSave || false}
    {isLoading}
    onAction={saveUsername}
    onCancel={resetDialogState}
    showActionButton={dialogDetails.showActionButton}
    cancelButtonlabel={dialogDetails.cancelButtonlabel}
    bind:showDialog
  >
    {#if step === 1}
      <div class="space-y-4">
        <div class="space-y-2">
          <label for="current-username" class="text-sm font-medium leading-none">
            Current Username
          </label>
          <Input id="current-username" value={currentUsername} disabled class="bg-muted" />
        </div>
        <IdentFormInput
          {form}
          fieldName="username"
          placeholder="e.g. 'giraffe08'"
          label="Username"
          {identType}
          {isLoading}
          suggestUsername={getSuggestedUsername}
          showInitialSuggestion={true}
        />
      </div>
    {/if}
  </UpdateDialog>
{/key}
