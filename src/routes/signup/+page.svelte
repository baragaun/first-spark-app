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

  const { getPasswordError, validatePassword } = passwordHelpers;

  // Step management
  const STEPS = {
    EMAIL: 'email',
    VERIFY: 'verify',
    CREDENTIALS: 'credentials',
    SUCCESS: 'success',
  };

  let currentStep = writable(STEPS.EMAIL);
  let email = '';
  let username = '';
  let password = '';
  let loading = false;
  let error = '';
  let actionId = '';

  // Handle email submission from the EmailVerification component
  const handleEmailSubmit = async ({ email: userEmail }: { email: string }) => {
    loading = true;
    error = '';
    try {
      email = userEmail; // Update the email variable
      console.log('Email submitted:', email);

      // Call signUpUser from myUserContext
      const response = await myUserContext.signUpUser(email);

      if (response.error) {
        error = response.error;
        return;
      }

      const verifyResponse = await myUserContext.verifyMyEmail(email);

      if (verifyResponse.error || !verifyResponse.response?.actionId) {
        error = verifyResponse.error || 'Failed to send verification email';
        return;
      }

      actionId = verifyResponse.response?.actionId;
      currentStep.set(STEPS.VERIFY);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to sign up';
      console.error('Error signing up:', err);
    } finally {
      loading = false;
    }
  };

  // Handle verification callback
  const handleVerify = async ({code }: {code: string }) => {
    loading = true;
    error = '';
    try {
      // Call verifyMultiStepActionToken from myUserContext
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
  const handleResend = (event: CustomEvent<{ email: string }>) => {
    // Any additional logic for resending
    console.log('Resending code to:', event.detail.email);
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
      // todo Need to write updateUser code here
      // await myUserContext.updateMyUser({ userHandle: username, password: password });
      await goto('/');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create account';
      console.error('Error creating account:', err);
    } finally {
      loading = false;
    }
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
          : `Enter the six digit code we sent to ${email}`}
      >
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
        <EmailVerification
          bind:email
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
        <form on:submit|preventDefault={handleSignupSubmit} class="space-y-4">
          <div class="space-y-2">
            <Input
              type="text"
              placeholder="Username (e.g., CosmoExplorer, PixelPioneer)"
              bind:value={username}
              required
            />
            <p class="text-xs text-muted-foreground">
              Usernames are unique handles. We'll verify that yours is not already taken.
            </p>
          </div>
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
