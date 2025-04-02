<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import TokenForm from '@/components/token-form.svelte';
  import ErrorAlert from '@/components/error-alert.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import Button from '@/components/ui/button/button.svelte';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';
  import { MultiStepActionEventType, SidMultiStepActionProgress, UserIdentType } from '@baragaun/bg-node-client';
  import Input from '@/components/ui/input/input.svelte';

  let currentStep = writable(0);
  let identifier = $state('');
  let actionId = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  let message = $state('');
  let identError = $state('');
  let resendTimer = $state(30);
  let canResend = $state(false);
  let tokenStatus = $state(MsaTokenStatus.unset);
  let timerInterval: ReturnType<typeof setInterval>;

  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
      }
    }, 1000);
  };

  const handleResetPassword = async () => {
    loading = true;
    errorMessage = '';

    try {
      const response = await myUserContext.resetMyPassword(identifier);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        errorMessage = 'Failed to send verification code. Please try again.';
        return;
      }

      actionId = response.object.actionProgress.actionId;

      response.object.run.addListener({
        id: 'ResetPassword',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            // The notification failed to go out.
            console.error(
              'ResetPasswordPage.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );

            if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
              // We can ignore the failure to send the email in development.
              errorMessage = '';
              currentStep.set(1);
              startResendTimer();
              return;
            } else {
              errorMessage =
                'We could not send the verification token to your email. Please try again.';
            }

            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              'ResetPasswordPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );

            currentStep.set(1);
            startResendTimer();

            // Switching to the token input for
            tokenStatus = MsaTokenStatus.notificationSent;
            message = translate(AppUiMessage.msaTokenSent);
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'ResetPasswordPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'ResetPasswordPage.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(
              'ResetPasswordPage.multiStepActionListener: error.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log(
              'ResetPasswordPage.multiStepActionListener: success.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.success;
            // todo: don't use `errorMessage` as it's rendered as an error (red color)
            message = translate(AppUiMessage.msaTokenSuccess);
            currentStep.set(2);
          }
        },
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      errorMessage =
        err instanceof Error ? err.message : 'Unable to process your request. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    loading = true;
    try {
      // Use the sendMultiStepActionNotification method to resend the email
      const response = await myUserContext.sendMultiStepActionNotification(identifier);

      if (response !== true) {
        errorMessage =
          typeof response === 'string' ? response : 'Failed to resend verification code';
        return;
      }

      startResendTimer();
    } catch (error) {
      console.error('Error resending email:', error);
      errorMessage = 'Failed to resend verification code. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleVerifyToken = async (token: string, newPassword?: string) => {
    if (!token || (newPassword === undefined && $currentStep === 1)) {
      errorMessage = 'Verification code and new password are required';
      return;
    }

    loading = true;
    errorMessage = '';

    try {
      const result = await myUserContext.verifyMultiStepActionToken(actionId, token, newPassword);

      if (result !== true) {
        errorMessage = typeof result === 'string' ? result : 'Failed to verify code';
        return;
      }

      currentStep.set(2);
    } catch (err) {
      console.error('Error verifying reset code:', err);
      errorMessage =
        err instanceof Error ? err.message : 'Failed to verify code. Please try again.';
    } finally {
      loading = false;
    }
  };

  onDestroy(() => {
    clearInterval(timerInterval);
  });
</script>

<div class="mx-auto max-w-sm py-40">
  <Card.Root>
    {#if $currentStep === 0}
      <Card.Header>
        <Card.Title class="text-2xl">Reset your password</Card.Title>
        <Card.Description
          >We will email you a verification code if we can find this email address.</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <form onsubmit={handleResetPassword} class="space-y-4">
          <Input
            type="text"
            placeholder="Enter your email or username"
            bind:value={identifier}
            required
          />
          <Button type="submit" class="w-full" disabled={loading || !identifier }>
            {loading ? 'Sending email...' : 'Send email'}
          </Button>
          <div class="flex items-center justify-between">
            <Button variant="link" class="px-0 font-normal" href="/support">Need help?</Button>
          </div>
        </form>
      </Card.Content>
    {:else if $currentStep === 1}
      <TokenForm
        ident={identifier}
        showPasswordField={true}
        onSubmit={handleVerifyToken}
        onResend={handleResendEmail}
        onBack={() => currentStep.set(0)}
      />
    {:else}
      <Card.Header>
        <Card.Title class="text-2xl">Password Reset Complete</Card.Title>
        <Card.Description>
          Your password has been successfully reset. You can now sign in with your new password.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Button href="/" class="w-full">Go Home</Button>
      </Card.Content>
    {/if}
  </Card.Root>
  {#if errorMessage}
    <ErrorAlert bind:errorMessage />
  {/if}
</div>
