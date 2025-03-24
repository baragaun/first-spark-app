<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { myUserContext } from '$lib/context/my-user-context.svelte';
  import { MultiStepActionEventType, SidMultiStepActionProgress } from '@baragaun/bg-node-client';
  import EmailVerification from '@/components/email-verification.svelte';
  import TokenForm from '@/components/token-form.svelte';
  import CredentialForm from '@/components/credential-form.svelte';
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
  import { X } from 'lucide-svelte';

  let currentStep = writable(0);
  let email = $state('');
  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');
  let actionId = $state('');
  let emailSent = $state(false);

  // Handle email submission from the EmailVerification component
  const onEmailSubmit = async (email: string): Promise<void> => {
    loading = true;
    error = '';
    try {
      const response = await myUserContext.signUpUser(email);

      if (response.error || !response.myUser?.id) {
        error = response.error || 'Failed to sign up';
        return;
      }

      // todo: Verify that the sign up was successful

      currentStep.set(1);

      startEmailConfirmation(email).catch((error) => {
        console.error('Error starting email confirmation:', error);
        error = 'Failed to send verification email. Please try again.';
      });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to sign up';
      console.error('Error signing up:', err);
    } finally {
      loading = false;
    }
  };

  const startEmailConfirmation = async (email: string) => {
    loading = true;
    error = '';
    try {
      console.log('Email submitted:', email);

      const response = await myUserContext.verifyMyEmail(email);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        error = 'Failed to send the verification token. Please try again.';
        return;
      }

      actionId = response?.object.actionProgress?.actionId;
      currentStep.set(1);

      response.object.run.addListener({
        id: 'SignUpForm',

        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            // The notification failed to go out.
            console.error(
              'SignUpPage.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );
            error = 'We could not send the verification token to your email. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              'SignUpPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            emailSent = true;
            // todo: Show the verification code input to the user.
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'SignUpPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            error = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'SignUpPage.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            error = 'The verification token has expired. Please request a new one.';
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error('SignUpPage.multiStepActionListener: error.', action.notificationResult);
            error = 'A system error has occurred. Please try again later.';
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log(
              'ResetMyPasswordListener.onNotificationSentOrFailed: success.',
              action.notificationResult,
            );
            await goto('/');
          }
        },
      });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to sign up';
      console.error('Error signing up:', err);
    } finally {
      loading = false;
    }
    //
    //   const verifyResponse = await myUserContext.verifyMyEmail(email);
    //
    //   if (verifyResponse.error || !verifyResponse.response?.actionId) {
    //     error = verifyResponse.error || 'Failed to send verification email';
    //     return;
    //   }
    //
    //   actionId = verifyResponse.response?.actionId;
    //   expiredAt = verifyResponse.response?.expiresAt
    //     ? new Date(verifyResponse.response.expiresAt)
    //     : undefined;
    //   currentStep.set(STEPS.VERIFY);
    // } catch (err) {
    //   error = err instanceof Error ? err.message : 'Failed to sign up';
    //   console.error('Error signing up:', err);
    // } finally {
    //   loading = false;
    // }
  };

  // Handle verification callback
  const handleVerify = async (code: string) => {
    loading = true;
    error = '';
    try {
      // const client = await myUserContext.getClient();

      // const listener = new VerifyMyEmailListener('verify-email-listener', actionId, client);

      // client.operations.multiStepAction.addMultiStepActionListener(actionId, listener);

      const result = await myUserContext.verifyMultiStepActionToken(actionId, code);

      if (!result) {
        error = 'Verification failed';
        return;
      }

      console.log('Verification successful, moving to credentials step');
      currentStep.set(2);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to verify code';
      console.error('Error verifying code:', err);
    } finally {
      loading = false;
    }
  };

  // Handle back button from the EmailVerification component
  const handleBack = () => {
    if ($currentStep > 0) {
      currentStep.set($currentStep - 1);
    }
  };

  // Handle skip verification
  const handleSkip = () => {
    currentStep.set(2);
  };

  // Handle final signup
  const handleSignupSubmit = async () => {
    loading = true;
    error = '';
    try {
      const myUserId = myUserContext.myUserId;

      // First check if we have a valid user
      if (!myUserId) {
        error = 'User not found or not authenticated';
        return;
      }

      // Update username first
      const updateUserName = await myUserContext.updateMyUser({
        id: myUserId,
        userHandle: username,
      });

      if (updateUserName.error) {
        error = updateUserName.error;
        return;
      }

      // Then update password
      const updatePassword = await myUserContext.updateMyPassword('', password);

      if (updateUserName.error || updatePassword.error) {
        error = updateUserName.error || updatePassword.error || 'Failed to create account';
        return;
      }

      await goto('/');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create account';
      console.error('Error creating account:', err);
    } finally {
      loading = false;
    }
  };

  const handleResend = async () => {
    const response = await myUserContext.sendMultiStepActionNotification(actionId, email);

    if (!response || response.error) {
      error = 'We failed to send the verification token. Please try again.';
      return;
    }
    currentStep.set(1);
  };

  // Calculate remaining time until expiration
  const getRemainingTimeText = (expiryDate?: Date): string => {
    if (!expiryDate) return '';

    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffMins = Math.max(0, Math.ceil(diffMs / 60000));

    return `. Code expires in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  };
</script>

<div class="relative mx-auto flex h-screen items-center justify-center">
  <div class="relative w-full max-w-md px-4">
    {#if $currentStep === 0}
      <EmailVerification bind:email {onEmailSubmit} />
    {:else if $currentStep === 1}
      <TokenForm {email} onVerify={handleVerify} onResend={handleResend} onBack={handleBack} />
    {:else if $currentStep === 2}
      <CredentialForm onSubmit={handleSignupSubmit} onBack={handleBack} />
    {/if}

    <!-- Alert for errors -->
    {#if error}
      <Alert variant="destructive" class="relative mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          class="absolute right-2 top-2 h-6 w-6 p-0"
          onclick={() => (error = '')}
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </Button>
      </Alert>
    {/if}
  </div>
</div>
