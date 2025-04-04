<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { emailSchema } from '../account-settings-schema';
  import UpdateEmailForm from './update-email-form.svelte';
  import TokenForm from '@/components/token-form.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import {
    MultiStepActionEventType,
    type SidMultiStepActionProgress,
  } from '@baragaun/bg-node-client';

  interface EmailInputProps {
    currentEmail: string;
    onSave: (newEmail: string) => Promise<void>;
    emailForm: SuperValidated<Infer<typeof emailSchema>>;
  }

  let { currentEmail, onSave, emailForm }: EmailInputProps = $props();

  const form = superForm(emailForm, {
    validators: zodClient(emailSchema),
    validationMethod: 'oninput',
    onResult: ({ result }) => {
      isLoading = false;
      if (result.type === 'success') {
        handleEmailChange();
      }
    },
  });

  // Destructure form helpers
  const { form: formData, enhance, validateForm, errors } = form;

  // State variables
  let isLoading = $state(false);
  let showEmailEdit = $state(false);
  let showConfirmation = $state(false);
  let showVerification = $state(false);
  let error = $state('');
  let isPasswordValid = $state(false);
  let errorMessage = $state('');
  let mfaActionId: string | undefined; // <- no need to make it a state variable

  // Derived state to check if form has values and is valid
  let hasFormValues = $derived(
    $formData.email &&
      $formData.currentPassword &&
      !$errors.email &&
      !$errors.currentPassword &&
      isPasswordValid,
  );

  // Reset dialog state when closed
  function resetDialogState() {
    $formData.email = '';
    $formData.currentPassword = '';
    showConfirmation = false;
    showVerification = false;
    if (isLoading) isLoading = false;
  }

  // When opening the dialog, set initial values
  function openDialog() {
    showEmailEdit = true;
    // Initialize form with empty values to avoid validation errors on first render
    $formData.email = '';
    $formData.currentPassword = '';
  }

  // Handle email change
  const handleEmailChange = async () => {
    try {
      isLoading = true;
      errorMessage = '';

      // Show verification step

      // Send verification token to the new email
      const verifyMyEmailResponse = await myUserContext.verifyMyEmail($formData.email);

      if (
        !verifyMyEmailResponse ||
        verifyMyEmailResponse?.error ||
        !verifyMyEmailResponse.object ||
        verifyMyEmailResponse.object.error ||
        !verifyMyEmailResponse?.object.actionProgress?.actionId ||
        !verifyMyEmailResponse?.object.run
      ) {
        console.error('UpdateEmailDialog.handleEmailChange: verifyMyEmail failed.', {
          verifyMyEmailResponse,
        });
        errorMessage = verifyMyEmailResponse?.error || 'A system error occurred. Please try again.';
        showVerification = false;
        return;
      }

      console.log('Email confirmation started:', verifyMyEmailResponse);

      // Store the action ID for later verification
      mfaActionId = verifyMyEmailResponse?.object.actionProgress?.actionId;
      showVerification = true;

      // Set up event listener for the verification process
      verifyMyEmailResponse.object.run.addListener({
        id: 'UpdateEmailDialog',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            console.error(
              'UpdateEmailDialog.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );

            if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
              // We can ignore the failure to send the email in development.
              return;
            }

            errorMessage =
              'We could not send the verification token to your email. Please try again.';
            showVerification = false;
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(
              'UpdateEmailDialog.multiStepActionListener: error.',
              action.notificationResult,
            );
            errorMessage = 'A system error has occurred. Please try again later.';
            showVerification = false;
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The email change was successful.
            console.log(
              'UpdateEmailDialog.multiStepActionListener: success.',
              action.notificationResult,
            );

            // Update the email
            await updateNewEmail()

            // Show confirmation screen
            showVerification = false;
            showConfirmation = true;
          }
        },
      });
    } catch (error) {
      console.error('Error updating email:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to send verification';
      showVerification = false;
    } finally {
      isLoading = false;
    }
  };


  const updateNewEmail = async (): Promise<boolean> => {
    errorMessage = '';
    try {
      const result = await myUserContext.updateMyUser({
        email: $formData.email,
      });

      if (result.error) {
        errorMessage = result.error;
        return false;
      }
      return true;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to update email';
      console.error('Error updating email:', error);
      return false;
    }
  };

  // Handle verification token submission
  const handleEmailVerificationSubmit = async (code: string) => {
    try {
      isLoading = true;
      errorMessage = '';

      if (!mfaActionId) {
        console.error('UpdateEmailDialog.handleEmailVerificationSubmit: no mfaActionId.');
        errorMessage = 'A system error occurred. Please try again.';
        return;
      }

      const response = await myUserContext.verifyMultiStepActionToken(mfaActionId, code);

      if (response !== true) {
        console.error(
          'UpdateEmailDialog.handleEmailVerificationSubmit: verifyMultiStepActionToken failed.',
          { result: response },
        );
        errorMessage = response || 'Failed to verify the token. Please try again.';
        return;
      }

      // If verification is successful, update the email
      await onSave($formData.email);

      // Show confirmation screen
      showVerification = false;
      showConfirmation = true;
    } catch (error) {
      console.error('Error verifying code:', error);
      errorMessage = error instanceof Error ? error.message : 'A system error occurred';
    } finally {
      isLoading = false;
    }
  };

  // Handle resend verification token
  const handleResend = async () => {
    const response = await myUserContext.sendMultiStepActionNotification($formData.email);

    if (response !== true) {
      errorMessage = response || 'We failed to send the verification token. Please try again.';
      return;
    }
  };

  // Handle back button
  const handleBack = () => {
    showVerification = false;
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => openDialog()}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Email</p>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
      {currentEmail}
    </p>
    <ChevronRight
      class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </div>
</button>

<Dialog.Root
  open={showEmailEdit}
  onOpenChange={(open: boolean) => {
    showEmailEdit = open;
    if (!open) resetDialogState();
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    {#if showVerification}
      <Dialog.Header class="space-y-2">
        <Dialog.Title class="text-xl font-semibold">Verify your email</Dialog.Title>
        <Dialog.Description class="text-base text-muted-foreground">
          Enter the verification code sent to your new email address.
        </Dialog.Description>
      </Dialog.Header>

      <TokenForm
        ident={$formData.email}
        onSubmit={handleEmailVerificationSubmit}
        onResend={handleResend}
        onBack={handleBack}
      />

      {#if errorMessage}
        <div class="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      {/if}
    {:else if !showConfirmation}
      <Dialog.Header class="space-y-2">
        <Dialog.Title class="text-xl font-semibold">Change email</Dialog.Title>
        <Dialog.Description class="text-base text-muted-foreground">
          Enter your new email address and current password to verify.
        </Dialog.Description>
      </Dialog.Header>
      <div class="rounded-lg border bg-muted/50 p-4">
        <p class="text-sm font-medium text-muted-foreground">Current Email</p>
        <p class="mt-1 text-base">{currentEmail}</p>
      </div>

      <UpdateEmailForm
        {form}
        {isLoading}
        bind:isPasswordValid
        {hasFormValues}
        onCancel={() => (showEmailEdit = false)}
        onSave={handleEmailChange}
      />

      {#if errorMessage}
        <div class="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      {/if}
    {:else}
      <!-- Email confirmation screen -->
      <Dialog.Header>
        <Dialog.Title class="text-xl font-semibold">Email updated successfully</Dialog.Title>
      </Dialog.Header>
      <div class="mt-6 space-y-4">
        <p class="text-sm text-muted-foreground">
          Your email has been successfully changed to <span class="font-medium"
            >{$formData.email}</span
          >.
        </p>
        <Dialog.Footer class="flex justify-end">
          <Button
            variant="outline"
            onclick={() => {
              showEmailEdit = false;
              showConfirmation = false;
            }}
          >
            Close
          </Button>
        </Dialog.Footer>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
