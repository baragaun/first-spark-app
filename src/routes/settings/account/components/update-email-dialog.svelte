<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import ErrorAlert from '@/components/error-alert.svelte';
  import TokenForm from '@/components/token-form.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { AppUiMessage } from '@/types/enums';
  import {
    MultiStepActionEventType,
    type SidMultiStepActionProgress,
  } from '@baragaun/bg-node-client';
  import { ChevronRight } from 'lucide-svelte';
  import { type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { emailSchema } from '../account-settings-schema';
  import UpdateEmailForm from './update-email-form.svelte';

  interface EmailInputProps {
    currentEmail: string;
    onSave: (newEmail: string) => Promise<void>;
    emailForm: SuperValidated<Infer<typeof emailSchema>>;
  }

  let { currentEmail, onSave, emailForm }: EmailInputProps = $props();

  const STEPS = {
    EMAIL_FORM: 0,
    VERIFICATION: 1,
    CONFIRMATION: 2,
  };

  let isLoading = $state(false);
  let showEmailEdit = $state(false);
  let errorMessage = $state('');
  let isPasswordValid = $state(false);
  let mfaActionId: string | undefined;
  let currentStep = $state(STEPS.EMAIL_FORM);

  // Reset dialog state when closed
  function resetDialogState() {
    currentStep = STEPS.EMAIL_FORM;
    isLoading = false;
    errorMessage = '';
    isPasswordValid = false;
    mfaActionId = undefined;
    emailForm.data.email = '';
    emailForm.data.currentPassword = '';
  }

  // Handle email change
  const handleEmailChange = async (email: string, password: string) => {
    try {
      // Store values in the SuperForm data
      emailForm.data.email = email;
      emailForm.data.currentPassword = password;

      isLoading = true;
      errorMessage = '';

      console.log('email', email);

      // Send verification token to the new email
      const verifyMyEmailResponse = await myUserContext.verifyMyEmail(email);

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
        errorMessage = verifyMyEmailResponse.error || AppUiMessage.systemError;
        return;
      }

      console.log('Email confirmation started:', verifyMyEmailResponse);

      mfaActionId = verifyMyEmailResponse?.object.actionProgress?.actionId;
      currentStep = STEPS.VERIFICATION;

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
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            console.log(
              'UpdateEmailDialog.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'UpdateEmailDialog.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'UpdateEmailDialog.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            errorMessage = 'The verification token has expired. Please request a new one.';
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(
              'UpdateEmailDialog.multiStepActionListener: error.',
              action.notificationResult,
            );
            errorMessage = 'A system error has occurred. Please try again later.';
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The email has been updated now.
            console.log(
              'UpdateEmailDialog.multiStepActionListener: success.',
              action.notificationResult,
            );
            await updateNewEmail(email);
            currentStep = STEPS.CONFIRMATION;
          }
        },
      });
    } catch (error) {
      console.error('Error updating email:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to send verification';
    } finally {
      isLoading = false;
    }
  };

  const updateNewEmail = async (email: string): Promise<boolean> => {
    errorMessage = '';
    try {
      const result = await myUserContext.updateMyUser({
        email: email,
      });

      if (result.error) {
        console.log('updateNewEmail: fail.', result);
        errorMessage = result.error;
        return false;
      }
      console.log('updateNewEmail: success.', result);
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
      await onSave(emailForm.data.email);
    } catch (error) {
      console.error('Error verifying code:', error);
      errorMessage = error instanceof Error ? error.message : 'A system error occurred';
    } finally {
      isLoading = false;
    }
  };

  // Handle resend verification token
  const handleResendVerificationToken = async () => {
    if (!mfaActionId) {
      console.error('UpdateEmailDialog.handleResend: no mfaActionId.');
      errorMessage = 'A system error occurred. Please try again.';
      return;
    }

    const response = await myUserContext.sendMultiStepActionNotification(mfaActionId);

    if (response !== true) {
      errorMessage = response || 'We failed to send the verification token. Please try again.';
      return;
    }
  };

  const handleBack = () => {
    currentStep = STEPS.EMAIL_FORM;
    errorMessage = '';
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => (showEmailEdit = true)}
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
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    {#if currentStep === STEPS.VERIFICATION}
      <Dialog.Header class="space-y-2">
        <Dialog.Title class="text-xl font-semibold">Verify your email</Dialog.Title>
        <Dialog.Description class="text-base text-muted-foreground">
          Enter the verification code sent to your new email address.
        </Dialog.Description>
      </Dialog.Header>

      <TokenForm
        ident={emailForm.data.email}
        onSubmit={handleEmailVerificationSubmit}
        onResend={handleResendVerificationToken}
        onBack={handleBack}
      />

      {#if errorMessage}
        <ErrorAlert bind:errorMessage />
      {/if}
    {:else if currentStep === STEPS.CONFIRMATION}
      <!-- Email confirmation screen -->
      <Dialog.Header>
        <Dialog.Title class="text-xl font-semibold">Email updated successfully</Dialog.Title>
      </Dialog.Header>
      <div class="mt-6 space-y-4">
        <p class="text-sm text-muted-foreground">
          Your email has been successfully changed to <span class="font-medium"
            >{emailForm.data.email}</span
          >.
        </p>
        <Dialog.Footer class="flex justify-end">
          <Button
            variant="outline"
            onclick={() => {
              showEmailEdit = false;
              resetDialogState();
            }}
          >
            Close
          </Button>
        </Dialog.Footer>
      </div>
    {:else}
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
        {emailForm}
        bind:isLoading
        bind:isPasswordValid
        onCancel={() => {
          showEmailEdit = false;
          resetDialogState();
        }}
        onSave={handleEmailChange}
      />

      {#if errorMessage}
        <ErrorAlert bind:errorMessage />
      {/if}
    {/if}
  </Dialog.Content>
</Dialog.Root>
