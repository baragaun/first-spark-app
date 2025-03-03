<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import * as Switch from '$lib/components/ui/switch';
  import { authStore } from '$lib/components/nav-bar.svelte';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import EmailVerification from '$lib/components/email-verification.svelte';
  import AuthCard from '$lib/components/ui/auth-card.svelte';

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
  let confirmPassword = '';
  let loading = false;
  let isAgeConfirmed = false;

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

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSymbol,
    };
  };

  const getPasswordError = (password: string) => {
    if (!password) return '';
    const validation = validatePassword(password);

    if (!validation.minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (
      !(
        validation.hasUpperCase &&
        validation.hasLowerCase &&
        validation.hasNumber &&
        validation.hasSymbol
      )
    ) {
      return 'Password must include uppercase, lowercase, number and special character';
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
          ? 'By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy.'
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
        description="First Spark is anonymous, so your username is what you'll go by here. Choose wisely—because once you get a name, you can't change it."
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
              Suggestions: {email.split('@')[0]}Spark, Creative{Math.floor(Math.random() * 1000)},
              Spark{Math.floor(Math.random() * 10000)}
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
                  <li
                    class:text-destructive={!/[A-Z]/.test(password)}
                    class:text-green-500={/[A-Z]/.test(password)}
                  >
                    One uppercase letter
                  </li>
                  <li
                    class:text-destructive={!/[a-z]/.test(password)}
                    class:text-green-500={/[a-z]/.test(password)}
                  >
                    One lowercase letter
                  </li>
                  <li
                    class:text-destructive={!/[0-9]/.test(password)}
                    class:text-green-500={/[0-9]/.test(password)}
                  >
                    One number
                  </li>
                  <li
                    class:text-destructive={!/[!@#$%^&*(),.?":{}|<>]/.test(password)}
                    class:text-green-500={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
                  >
                    One special character
                  </li>
                </ul>
              </div>
            {/if}
            {#if password && getPasswordError(password)}
              <p class="text-xs text-destructive">{getPasswordError(password)}</p>
            {/if}
          </div>
          <div class="relative space-y-2">
            <PasswordInput bind:value={confirmPassword} placeholder="Confirm password" required />
            {#if password && confirmPassword && password !== confirmPassword}
              <p class="text-xs text-destructive">Passwords do not match</p>
            {/if}
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between space-x-2">
              <label for="age-confirmation" class="text-sm font-medium">
                I confirm that I am at least 18 years of age.
              </label>
              <Switch.Root bind:checked={isAgeConfirmed} id="age-confirmation" />
            </div>
            {#if !isAgeConfirmed}
              <p class="text-xs text-destructive">
                You must confirm you are at least 18 years old to continue.
              </p>
            {/if}
          </div>
          <Button
            type="submit"
            class="w-full"
            disabled={loading ||
              !isAgeConfirmed ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              !validatePassword(password).isValid}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </AuthCard>
    {/if}
  </div>
</div>
