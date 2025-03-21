<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import EmailVerification from '$lib/components/email-verification.svelte';
  import AuthCard from '$lib/components/ui/auth-card.svelte';
  import passwordHelpers from '$lib/helpers/password-helpers';
  import { myUserContext } from '$lib/context/my-user-context.svelte';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
  import X from 'lucide-svelte/icons/x';
  import { VerifyMyEmailListener } from '@/context/listeners/verify-email-listener';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { MultiStepActionEventType, SidMultiStepActionProgress } from '@baragaun/bg-node-client'

  const { getPasswordError, validatePassword } = passwordHelpers;

  // Step management
  const STEPS = {
    EMAIL: 'email',
    VERIFY: 'verify',
    CREDENTIALS: 'credentials',
  };

  let currentStep = writable(STEPS.EMAIL);
  let email = $state('');
  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');
  let actionId = $state('');
  let expiredAt = $state<Date | undefined>(undefined);
  let checkingUsername = $state(false);
  let usernameError = $state('');
  let suggestedHandle = $state('');
  let emailSent = false

  $effect(() => {
    const user = myUserContext.getMyUser();
    if (user && user.userHandle) {
      username = user.userHandle;
    }
  });

  // Handle email submission from the EmailVerification component
  const handleEmailSubmit = async (email: string): Promise<void> => {
    loading = true;
    error = '';
    try {
      const response = await myUserContext.signUpUser(email);

      if (response.error) {
        error = response.error;
        return;
      }

      // todo: Verify that the sign up was successful

      startEmailConfirmation(email);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to sign up'
      console.error('Error signing up:', err)
    } finally {
      loading = false
    }
  }

  const startEmailConfirmation = async (email) => {
    loading = true
    error = ''
    try {
      email = userEmail // Update the email variable
      console.log('Email submitted:', email)

      const response = await myUserContext.verifyMyEmail(email)

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        error = 'Failed to send the verification token. Please try again.'
        return
      }

      actionId = response?.object.actionProgress?.actionId
      currentStep.set(STEPS.VERIFY)

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
            )
            error = 'We could not send the verification token to your email. Please try again.'
            return
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              'SignUpPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            )
            emailSent = true
            // todo: Show the verification code input to the user.
            return
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'SignUpPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            )
            error = 'We could not verify the token you entered. Please try again.'
            return
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'SignUpPage.multiStepActionListener: timeout.',
              action.notificationResult,
            )
            error = 'The verification token has expired. Please request a new one.'
            return
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(
              'SignUpPage.multiStepActionListener: error.',
              action.notificationResult,
            )
            error = 'A system error has occurred. Please try again later.'
            return
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log(
              'ResetMyPasswordListener.onNotificationSentOrFailed: success.',
              action.notificationResult,
            )
            await goto('/')
          }
        }
      })
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to sign up'
      console.error('Error signing up:', err)
    } finally {
      loading = false
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
      const client = await myUserContext.getClient();

      const listener = new VerifyMyEmailListener('verify-email-listener', actionId, client);

      client.operations.multiStepAction.addMultiStepActionListener(actionId, listener);

      const result = await myUserContext.verifyMultiStepActionToken(actionId, code);

      if (!result) {
        error = 'Verification failed';
        return;
      }

      console.log('Verification successful, moving to credentials step');
      currentStep.set(STEPS.CREDENTIALS);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to verify code';
      console.error('Error verifying code:', err);
    } finally {
      loading = false;
    }
  };

  // Handle resend from the EmailVerification component
  const handleResend = async (email: string) => {
    const verifyResponse = await myUserContext.verifyMyEmail(email);

    if (verifyResponse.error || !verifyResponse.response?.actionId) {
      error = verifyResponse.error || 'Failed to send verification email';
      return;
    }

    actionId = verifyResponse.response?.actionId;
    expiredAt = verifyResponse.response?.expiresAt
      ? new Date(verifyResponse.response.expiresAt)
      : undefined;
    currentStep.set(STEPS.VERIFY);
  };

  // Handle back button from the EmailVerification component
  const handleBack = (event: CustomEvent) => {
    // Any additional logic when going back
  };

  // Handle skip verification
  const handleSkip = () => {
    currentStep.set(STEPS.CREDENTIALS);
  };

  // Handle final signup
  const handleSignupSubmit = async () => {
    loading = true;
    error = '';
    try {
      const client = await myUserContext.getClient();

      // First check if we have a valid user
      if (!client || !client.myUserId) {
        error = 'User not found or not authenticated';
        return;
      }

      // Update username first
      const updateUserName = await myUserContext.updateMyUser({
        id: client.myUserId,
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
    {#if $currentStep !== STEPS.EMAIL}
      <Button
        variant="ghost"
        size="sm"
        class="absolute -top-12 left-0"
        onclick={() => currentStep.set($currentStep === STEPS.VERIFY ? STEPS.EMAIL : STEPS.VERIFY)}
      >
        ← Back
      </Button>
    {/if}

    {#if $currentStep === STEPS.EMAIL || $currentStep === STEPS.VERIFY}
      <AuthCard
        title={$currentStep === STEPS.EMAIL ? 'Sign Up' : 'Verify your email'}
        description={$currentStep === STEPS.EMAIL
          ? 'By continuing, you agree to our User Agreement and acknowledge that you understand and agree to our Privacy Policy.'
          : `Enter the six digit code we sent to ${email}${expiredAt ? getRemainingTimeText(expiredAt) : ''}`}
      >
        {#if error}
          <Alert variant="destructive" class="relative mb-4">
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
        <EmailVerification
          {email}
          initialStep={$currentStep === STEPS.EMAIL ? 'email' : 'verify'}
          buttonText="Continue"
          verifyButtonText="Verify"
          loadingText="Sending..."
          verifyingText="Verifying..."
          showSkipButton={true}
          onEmailSubmit={handleEmailSubmit}
          onVerify={handleVerify}
          onResend={() => handleResend}
          onBack={() => handleBack}
          onSkip={handleSkip}
        />

        {#if $currentStep === STEPS.EMAIL}
          <div class="mt-4 text-center text-sm">
            <span class="text-muted-foreground">Already a have an account?</span>
            {' '}
            <Button variant="link" class="px-1 font-normal" href="/signin">Log In</Button>
          </div>
        {/if}
      </AuthCard>
    {:else if $currentStep === STEPS.CREDENTIALS}
      <AuthCard
        title="Create your username and password"
        showBackButton={true}
        onBack={() => currentStep.set(STEPS.VERIFY)}
      >
        <form onsubmit={handleSignupSubmit} class="space-y-4">
          <div class="space-y-2">
            <Input
              type="text"
              placeholder="Username (e.g., CosmoExplorer, PixelPioneer)"
              bind:value={username}
              required
              onblur={async () => {
                if (username) {
                  checkingUsername = true;
                  usernameError = '';
                  const isAvailable = await myUserContext.isUserIdentAvailable(
                    username,
                    UserIdentType.userHandle,
                  );
                  checkingUsername = false;

                  if (!isAvailable) {
                    usernameError = 'This username is unavailable.';
                  }
                }
              }}
            />
            {#if checkingUsername}
              <p class="text-xs text-muted-foreground">Checking username availability...</p>
            {:else if usernameError}
              <p class="text-xs text-destructive">{usernameError}</p>
            {/if}
          </div>
          {#if suggestedHandle}
            <p class="text-xs text-muted-foreground">
              Suggested username: {suggestedHandle}
            </p>
          {/if}
          <div class="relative space-y-2">
            <PasswordInput bind:value={password} placeholder="Password" required />
            {#if password}
              <div class="space-y-2 text-xs">
                <p class="text-muted-foreground">Password requirements:</p>
                <ul class="list-inside list-disc space-y-1 pl-2">
                  <li
                    class:text-destructive={password.length < 8}
                    class:text-green-500={password.length >= 8}
                  >
                    At least 8 characters
                  </li>
                </ul>
              </div>
            {/if}
            {#if password && getPasswordError(password)}
              <p class="text-xs text-destructive">{getPasswordError(password)}</p>
            {/if}
          </div>
          <Button
            type="submit"
            class="w-full"
            disabled={loading || !password || !validatePassword(password).isValid}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </AuthCard>
    {/if}
  </div>
</div>
