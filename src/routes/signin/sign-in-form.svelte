<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '@/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
  import { myUserContext } from '@/context/my-user-context.svelte';
  import { goto } from '$app/navigation';
  import TokenForm from '@/components/token-form.svelte';
  import X from 'lucide-svelte/icons/x';
  import { MultiStepActionEventType, SidMultiStepActionProgress } from '@baragaun/bg-node-client';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';

  type FormState = 'login' | 'token';

  // Data:
  let actionId = $state<string | undefined>(undefined);

  // Input:
  let password = $state('');
  let userIdent = $state(''); // either an email or a username

  // Indicators:
  let loading = $state(false);

  // Messaging to user:
  let error = $state('');
  let message = $state('');

  // Form state:
  let formState: FormState = $state('login');
  let resendTimer = $state(30);
  let canResend = $state(false);
  let timerInterval: ReturnType<typeof setInterval>;
  // let showPasswordInput = $state(false);

  // todo: use this to show some status indicator?
  let tokenStatus = $state(MsaTokenStatus.unset);

  // Track emails that have active cooldowns
  const emailCooldowns = $state(new Map<string, number>());

  const onSignInWithPassword = async () => {
    if (formState !== 'login' || !password) {
      await startTokenSignIn();
      return;
    }
    // console.log('SignInForm.onSignInWithPassword: sending', { userIdent, password });

    try {
      loading = true;
      error = '';

      const response = await myUserContext.signInUser(userIdent, password);

      if (response?.error) {
        error = translate(response.error, AppUiMessage.systemError);
        return;
      }

      if (!response || !response.object || !response.object.myUser) {
        // console.error('SignInForm.onSignInWithPassword: incorrect response', { response });
        error = translate(AppUiMessage.systemError);
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignInForm.onSignInWithPassword: error:', { error });
      error = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const onSendToken = async (token: string): Promise<void> => {
    try {
      if (!actionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        error = translate(AppUiMessage.systemError);
        return;
      }

      loading = true;
      error = '';

      const response = await myUserContext.verifyMultiStepActionToken(actionId, token);

      // Here, we don't have to add another listener, since we already added one when
      // we called `signInWithToken`. We do want to check the `result` object to
      // make sure the `verifyMultiStepActionToken` call did not fail. But this
      // function does not actually verify the token. For that, we are waiting for
      // the listener to be called with the result of the token verification.

      if (!response) {
        console.error('SignInForm.handleVerifyOtp: invalid response:', { result: response });
        error = translate(AppUiMessage.systemError);
        tokenStatus = MsaTokenStatus.unset;
        return;
      }

      if (response.error) {
        error = translate(AppUiMessage.systemError);
        // todo: translate error?
        error = response.error;
        tokenStatus = MsaTokenStatus.unset;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
    } catch (error) {
      console.error('SignInForm.handleVerifyOtp: error:', { error });
      error = translate(AppUiMessage.systemError);
      tokenStatus = MsaTokenStatus.unset;
    } finally {
      loading = false;
    }
  };

  const onSendNotification = async (email?: string) => {
    tokenStatus = MsaTokenStatus.unset;

    if (!actionId) {
      console.error('SignInForm.handleResendOtp: actionId missing.');
      error = translate(AppUiMessage.systemError);
      return;
    }

    if (emailCooldowns.has(userIdent)) {
      const cooldownEnd = emailCooldowns.get(userIdent) || 0;
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
      error = '';

      const response = await myUserContext.sendMultiStepActionNotification(actionId, email);

      if (response?.error) {
        console.error('SignInForm.handleResendOtp: error:', { error: response.error });
        error = translate(AppUiMessage.systemError);
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
      startResendTimer(userIdent);
    } catch (error) {
      console.error('SignInForm.handleResendOtp: error:', { error });
      error = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const onSwitchToToken = () => {
    formState = 'token';
  };

  const onSwitchToLogin = () => {
    formState = 'login';
  };

  const startTokenSignIn = async () => {
    // Check if this email has an active cooldown
    if (emailCooldowns.has(userIdent)) {
      const cooldownEnd = emailCooldowns.get(userIdent) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        formState = 'token';
        return;
      }
    }

    loading = true;
    error = '';

    try {
      const response = await myUserContext.signInWithToken(userIdent);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        error = 'Failed to send magic link. Please try again.';
        return;
      }

      startResendTimer(userIdent);
      actionId = response?.object.actionProgress?.actionId;

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
            error = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              'SignInPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            // Switching to the token input for
            formState = 'token';
            tokenStatus = MsaTokenStatus.notificationSent;
            message = translate(AppUiMessage.msaTokenSent);
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'SignInPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            error = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'SignInPage.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.sendingFailed;
            error = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error('SignInPage.multiStepActionListener: error.', action.notificationResult);
            tokenStatus = MsaTokenStatus.verificationFailed;
            error = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log(
              'ResetMyPasswordListener.onNotificationSentOrFailed: success.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.success;
            error = translate(AppUiMessage.msaTokenSuccess);
            await goto('/');
          }
        },
      });
    } catch (error) {
      console.error('SignInForm.startTokenSignIn:', { error });
      tokenStatus = MsaTokenStatus.verificationFailed;
      error = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const startResendTimer = (emailAddress: string) => {
    resendTimer = 30;
    canResend = false;
    emailCooldowns.set(emailAddress, Date.now() + resendTimer * 1000);

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

  const isNotificationSent = (): boolean => {
    return tokenStatus === MsaTokenStatus.notificationSent;
  };
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign In</Card.Title>
    <Card.Description>
      {#if formState === 'token'}
        {#if isNotificationSent()}
          A verification code has been sent to {userIdent}. Please check your email.
        {:else}
          Sending verification code to {userIdent}...
        {/if}
        Enter the verification code sent to {userIdent}
      {:else}
        Enter your email below to login to your account
      {/if}
    </Card.Description>
  </Card.Header>
  <Card.Content>
    {#if formState === 'token'}
      <TokenForm
        email = {userIdent}
        onVerify = {onSendToken}
        onResend = {onSendNotification}
        onBack={onSwitchToLogin}
      />
    {:else}
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
      <form onsubmit={onSignInWithPassword}>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email or Username</Label>
            <Input
              id="email"
              type="email"
              bind:value={userIdent}
              placeholder="me@example.com, myusername"
              required
            />
          </div>

          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="/reset-password" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" bind:value={password} required />
          </div>

          <Button type="submit" class="w-full">Sign in</Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="/signup" class="underline">Sign up </a>
        </div>
      </form>
    {/if}
  </Card.Content>
</Card.Root>
