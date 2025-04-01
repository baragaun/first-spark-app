<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '@/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import { goto } from '$app/navigation';
  import {
    MultiStepActionEventType,
    SidMultiStepActionProgress,
    UserIdentType,
  } from '@baragaun/bg-node-client';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';
  import { writable } from 'svelte/store';
  import TokenForm from '@/components/token-form.svelte';
  import PasswordInput from '@/components/ui/password-input';
  import ErrorAlert from '@/components/error-alert.svelte';
  import { z } from 'zod';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  let identifier = $state('');
  let identType = $state(UserIdentType.email);
  let mfaActionId = $state<string | undefined>(undefined);
  let password = $state('');
  let loading = $state(false);
  let tokenStatus = $state(MsaTokenStatus.unset);
  let errorMessage = $state('');
  let message = $state('');
  let resendTimer = $state(30);
  let canResend = $state(false);
  let timerInterval: ReturnType<typeof setInterval>;
  let currentStep = writable(0);
  // 0 for token sign in, 1 for verification code, 2 for password sign in

  // Track emails that have active cooldowns
  const emailCooldowns = $state(new Map<string, number>());
  // Define Zod schemas for validation
  const emailSchema = z.string().email('Not a valid email address');
  const handleSchema = z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(30, 'Cannot exceed 30 characters');

  // Function to determine identifier type using Zod
  const determineIdentifierType = (value: string): UserIdentType => {
    // Try to validate as email first
    const emailResult = emailSchema.safeParse(value);
    if (emailResult.success) {
      return UserIdentType.email;
    }

    // Then try to validate as handle
    const handleResult = handleSchema.safeParse(value);
    if (handleResult.success) {
      return UserIdentType.userHandle;
    }

    // Default to email if unclear (validation will catch errors later)
    return UserIdentType.email;
  };

  const signMeInWithPassword = async () => {
    try {
      loading = true;
      errorMessage = '';

      const response = await myUserContext.signMeInWithPassword(identifier, identType, password);

      if (response !== true) {
        // `response` is already translated
        errorMessage = response;
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignInForm.signMeInWithPassword: error:', { error });
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const onSendToken = async (token: string): Promise<void> => {
    try {
      if (!mfaActionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        errorMessage = translate(AppUiMessage.systemError);
        return;
      }

      loading = true;
      errorMessage = '';

      const response = await myUserContext.verifyMultiStepActionToken(mfaActionId, token);

      // Here, we don't have to add another listener, since we already added one when
      // we called `signMeInWithToken`. We do want to check the `result` object to
      // make sure the `verifyMultiStepActionToken` call did not fail. But this
      // function does not actually verify the token. For that, we are waiting for
      // the listener to be called with the result of the token verification.

      if (response !== true) {
        console.error('SignInForm.handleVerifyOtp: invalid response:', { result: response });
        errorMessage = translate(AppUiMessage.systemError); // todo: translate?
        tokenStatus = MsaTokenStatus.unset;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
    } catch (error) {
      console.error('SignInForm.handleVerifyOtp: error:', { error });
      errorMessage = translate(AppUiMessage.systemError);
      tokenStatus = MsaTokenStatus.unset;
    } finally {
      loading = false;
    }
  };

  const onSendNotification = async () => {
    tokenStatus = MsaTokenStatus.unset;

    if (!mfaActionId) {
      console.error('SignInForm.handleResendOtp: actionId missing.');
      errorMessage = translate(AppUiMessage.systemError); // todo: translate?
      return;
    }

    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        tokenStatus = MsaTokenStatus.unset;
        return;
      }
    }

    try {
      loading = true;
      errorMessage = '';

      //todo I will also like to send identifier type.
      const response = await myUserContext.sendMultiStepActionNotification(identifier);

      if (typeof response === 'string') {
        console.error('SignInForm.handleResendOtp: error:', { error: response });
        errorMessage = response;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
      startResendTimer(identifier);
    } catch (error) {
      console.error('SignInForm.handleResendOtp: error:', { error });
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const startTokenSignIn = async () => {
    // Check if this email has an active cooldown
    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        return;
      }
    }

    loading = true;
    errorMessage = '';

    try {
      const response = await myUserContext.signMeInWithToken(identifier);

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

      startResendTimer(identifier);
      mfaActionId = response.object.actionProgress.actionId;
      currentStep.set(1);

      response.object.run.addListener({
        id: 'SignInForm',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            // The notification failed to go out.
            console.error(
              'SignInPage.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              'SignInPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            // Switching to the token input for
            tokenStatus = MsaTokenStatus.notificationSent;
            message = translate(AppUiMessage.msaTokenSent);
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'SignInPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'SignInPage.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error('SignInPage.multiStepActionListener: error.', action.notificationResult);
            tokenStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log('SignInPage.multiStepActionListener: success.', action.notificationResult);
            tokenStatus = MsaTokenStatus.success;
            // todo: don't use `errorMessage` as it's rendered as an error (red color)
            errorMessage = translate(AppUiMessage.msaTokenSuccess);
            goto('/');
          }
        },
      });
    } catch (error) {
      console.error('SignInForm.startTokenSignIn:', { error });
      tokenStatus = MsaTokenStatus.verificationFailed;
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const startResendTimer = (emailAddress: string) => {
    resendTimer = 30;
    canResend = false;
    emailCooldowns.set(emailAddress, Date.now() + resendTimer * 1000);
    //todo also need to store actionId!

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
        emailCooldowns.delete(emailAddress);
      }
    }, 1000);
  };

  const handleSignIn = async () => {
    loading = true;
    errorMessage = '';

    try {
      if ($currentStep === 2) {
        await signMeInWithPassword();
      } else {
        console.log('starting token sign in');
        await startTokenSignIn();
      }
    } catch (err) {
      console.error('Error signing in:', err);
      errorMessage = 'Invalid credentials. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleIdentifierChange = () => {
    if (identifier) {
      identType = determineIdentifierType(identifier);
    }
  };

  $effect(() => {
    if (identifier) {
      handleIdentifierChange();
    }
  });

  // Function to validate the current identifier based on its type
  const validateIdentifier = (): boolean => {
    if (!identifier) {
      return false;
    }

    if (identType === UserIdentType.email) {
      const result = emailSchema.safeParse(identifier);
      return result.success;
    } else {
      const result = handleSchema.safeParse(identifier);
      return result.success;
    }
  };
</script>

<div class="mx-auto max-w-sm">
  {#if $currentStep === 1}
    <TokenForm
      ident={identifier}
      onSubmit={onSendToken}
      onResend={onSendNotification}
      onBack={() => {
        currentStep.set(0);
      }}
    />
  {:else}
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-2xl">Sign In</Card.Title>
        <Card.Description>Enter your email below to login to your account</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email or username">Email or Username</Label>
            <Input
              bind:value={identifier}
              id="identifier"
              placeholder="me@example.com, myusername"
              oninput={handleIdentifierChange}
              required
            />
          </div>

          {#if $currentStep === 2}
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a href="/reset-password" class="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <PasswordInput id="password" bind:value={password} required />
            </div>
          {/if}

          <Button
            type="submit"
            class="w-full"
            disabled={loading || !validateIdentifier() || ($currentStep === 2 && !password)}
            onclick={handleSignIn}
            >Sign in
          </Button>

          {#if $currentStep === 0}
            <Button
              variant="outline"
              class="w-full"
              onclick={() => {
                currentStep.set(2);
              }}
            >
              Sign in with password
            </Button>
          {/if}
        </div>
        {#if $currentStep === 2}
          <div class="mt-4 text-center text-sm">
            <Button
              variant="link"
              onclick={() => {
                currentStep.set(0);
              }}
              class="underline"
            >
              Sign in with your email
            </Button>
          </div>
        {/if}
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="/signup" class="underline"> Sign up </a>
        </div>
      </Card.Content>
    </Card.Root>
  {/if}
  <!-- Alert for errors -->
  {#if errorMessage}
    <ErrorAlert bind:errorMessage />
  {/if}
</div>
