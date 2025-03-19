<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '@/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
  import { myUserContext } from '@/context/my-user-context.svelte';
  import { goto } from '$app/navigation';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import OtpVerification from '$lib/components/otp-verification.svelte';
  import X from 'lucide-svelte/icons/x';

  let identifier = ''; // either an email or a username
  let identType = UserIdentType.email; // either an email or a username
  let password = '';
  let loading = false;
  let error = '';
  let emailSent = false;
  let resendTimer = 30;
  let canResend = false;
  let actionId : string;
  let timerInterval: ReturnType<typeof setInterval>;

  // Track emails that have active cooldowns
  const emailCooldowns = new Map<string, number>();

  let showPasswordInput = false;
  function togglePasswordInput() {
    showPasswordInput = !showPasswordInput;
  }

  const handleSignIn = async () => {
    loading = true;
    error = '';

    console.log('handleSignIn', identifier, password);

    try {
      if (showPasswordInput && password) {
        const user = await myUserContext.signInUser(identifier, identType, password);
        console.log('handleSignIn', user);
        if (user.myUser) {
          await goto('/');
        } else {
          error = 'Invalid credentials. Please try again.';
        }
      } else {
        await handleTokenSignIn();
      }
    } catch (err) {
      console.error('Error signing in:', err);
      error = 'Invalid credentials. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleVerifyOtp = async ({ email, code }: { email: string; code: string }) => {
    try {
      loading = true;

      const user = await myUserContext.verifyMultiStepActionToken(actionId, code);
      if (user) {
        await goto('/');
      } else {
        return Promise.reject(new Error('Invalid verification code'));
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return Promise.reject(error);
    } finally {
      loading = false;
    }
  };

  const handleResendOtp = async ({ email }: { email: string }) => {
    try {
      await handleTokenSignIn();
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  const handleBackFromOtp = () => {
    emailSent = false;
  };

  const handleTokenSignIn = async () => {
    // Check if this email has an active cooldown
    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        emailSent = true;
        return;
      }
    }

    loading = true;
    error = '';

    try {
      const signInWithTokenResponse = await myUserContext.signInWithToken(identifier);

      if (!signInWithTokenResponse?.response?.actionId) {
        throw new Error('Failed to get action ID from sign-in response');
      }
      actionId = signInWithTokenResponse?.response?.actionId;
      emailSent = true;
      startResendTimer(identifier);
    } catch (err) {
      console.error('Error sending magic link:', err);
      error = 'Failed to send magic link. Please try again.';
      throw err;
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
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign In</Card.Title>
    <Card.Description>
      {#if emailSent}
        Enter the verification code sent to {identifier}
      {:else}
        Enter your email below to login to your account
      {/if}
    </Card.Description>
  </Card.Header>
  <Card.Content>
    {#if emailSent}
      <OtpVerification
        email={identifier}
        {resendTimer}
        {canResend}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackFromOtp}
      />
    {:else}
      {#if error}
        <Alert variant="destructive" class="mb-4 relative">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            class="absolute top-2 right-2 h-6 w-6 p-0"
            onclick={() => error = ''}
          >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </Button>
        </Alert>
      {/if}
      <form on:submit|preventDefault={handleSignIn}>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email or Username</Label>
            <Input id="email" type="email" bind:value={identifier} placeholder="me@example.com, myusername" required />
          </div>

          {#if showPasswordInput}
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a href="/reset-password" class="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" bind:value={password} required />
            </div>
          {/if}

          <Button type="submit" class="w-full">Sign in</Button>

          {#if !showPasswordInput}
            <Button variant="outline" class="w-full" onclick={togglePasswordInput}>
              Sign in with password
            </Button>
          {/if}
        </div>
        {#if showPasswordInput}
          <div class="mt-4 text-center text-sm">
            <Button variant="link" onclick={togglePasswordInput} class="underline">
              Sign in with your email
            </Button>
          </div>
        {/if}
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="/signup" class="underline"> Sign up </a>
        </div>
      </form>
    {/if}
  </Card.Content>
</Card.Root>
