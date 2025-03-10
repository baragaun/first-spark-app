<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/components/nav-bar.svelte';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import EmailVerification from '$lib/components/email-verification.svelte';
  import AuthCard from '$lib/components/ui/auth-card.svelte';

  type PasswordValidation = {
    minLength: boolean;
    notTooSimple: boolean;
    noRepetitivePattern: boolean;
    doesNotReuseEmail: boolean;
    isValid: boolean;
  };

  const commonPasswords = [
    '123456',
    'password',
    '123456789',
    '12345678',
    '12345',
    '1234567',
    '1234567890',
    'qwerty',
    'abc123',
    'password1',
    // Add more common passwords as needed
  ];

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

  // Handle email submission from the EmailVerification component
  const handleEmailSubmit = (event: CustomEvent<{ email: string }>) => {
    email = event.detail.email;
  };

  // Handle verification callback
  const handleVerify = async ({ email, code }: { email: string; code: string }) => {
    // verificationCode = code;
    // If verification is successful, move to credentials step
    currentStep.set(STEPS.CREDENTIALS);
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
    try {
      // TODO: Implement your signup logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      localStorage.setItem('authToken', 'your-auth-token');
      authStore.set({ isAuthenticated: true }); // Update auth store
      await goto('/');
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      loading = false;
    }
  };

  const validatePassword = (password: string): PasswordValidation => {
    const repetitivePattern = /^(.)\1+$/;
    const result: PasswordValidation = {
      minLength: true,
      notTooSimple: true,
      noRepetitivePattern: true,
      doesNotReuseEmail: true,
      isValid: true,
    };

    if (password.length < 8) {
      result.minLength = false;
      result.isValid = false;
    }

    if (commonPasswords.includes(password.toLowerCase())) {
      result.notTooSimple = false;
      result.isValid = false;
    }

    if (repetitivePattern.test(password)) {
      result.noRepetitivePattern = false;
      result.isValid = false;
    }

    if (email) {
      const firstEmailPart = email.split('@')[0];
      if (firstEmailPart && password.toLowerCase().includes(firstEmailPart.toLowerCase())) {
        result.doesNotReuseEmail = false;
        result.isValid = false;
      }
    }

    return result;
  };

  const getPasswordError = (password: string) => {
    if (!password) {
      return '';
    }

    const validation = validatePassword(password);

    if (!validation.minLength) {
      return 'Password must be at least 8 characters long';
    }

    if (
      !validation.notTooSimple ||
      !validation.noRepetitivePattern ||
      !validation.doesNotReuseEmail
    ) {
      return 'Password is too simple or guessable';
    }

    return '';
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
        <EmailVerification
          bind:email
          initialStep={$currentStep === STEPS.EMAIL ? 'email' : 'verify'}
          buttonText="Continue"
          verifyButtonText="Verify"
          loadingText="Sending..."
          verifyingText="Verifying..."
          showSkipButton={true}
          onEmailSubmit={() => handleEmailSubmit}
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
