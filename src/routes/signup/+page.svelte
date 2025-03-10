<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/components/nav-bar.svelte';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import EmailVerification from '$lib/components/email-verification.svelte';
  import AuthCard from '$lib/components/ui/auth-card.svelte';
  import { _ } from 'svelte-i18n';

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
      return $_('signup.password_errors.min_length');
    }

    if (
      !validation.notTooSimple ||
      !validation.noRepetitivePattern ||
      !validation.doesNotReuseEmail
    ) {
      return $_('signup.password_errors.too_simple');
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
        {$_('signup.buttons.back')}
      </Button>
    {/if}

    {#if $currentStep === STEPS.EMAIL || $currentStep === STEPS.VERIFY}
      <AuthCard
        title={$currentStep === STEPS.EMAIL ? $_('signup.title') : $_('signup.verify_email_title')}
        description={$currentStep === STEPS.EMAIL
          ? $_('signup.terms_agreement')
          : $_('signup.verify_code_message', { values: { email: email } })}
      >
        <EmailVerification
          bind:email
          initialStep={$currentStep === STEPS.EMAIL ? 'email' : 'verify'}
          buttonText={$_('signup.buttons.continue')}
          verifyButtonText={$_('signup.buttons.verify')}
          loadingText={$_('signup.buttons.sending')}
          verifyingText={$_('signup.buttons.verifying')}
          showSkipButton={true}
          onEmailSubmit={() => handleEmailSubmit}
          onVerify={handleVerify}
          onResend={() => handleResend}
          onBack={() => handleBack}
          onSkip={handleSkip}
        />

        {#if $currentStep === STEPS.EMAIL}
          <div class="mt-4 text-center text-sm">
            <span class="text-muted-foreground">{$_('signup.have_account')}</span>
            {' '}
            <Button variant="link" class="px-1 font-normal" href="/signin">
              {$_('signup.login_link')}
            </Button>
          </div>
        {/if}
      </AuthCard>
    {:else if $currentStep === STEPS.CREDENTIALS}
      <AuthCard
        title={$_('signup.create_credentials_title')}
        showBackButton={true}
        onBack={() => currentStep.set(STEPS.VERIFY)}
      >
        <form on:submit|preventDefault={handleSignupSubmit} class="space-y-4">
          <div class="space-y-2">
            <Input
              type="text"
              placeholder={$_('signup.username_placeholder')}
              bind:value={username}
              required
            />
            <p class="text-xs text-muted-foreground">
              {$_('signup.username_description')}
            </p>
          </div>
          <div class="relative space-y-2">
            <PasswordInput
              bind:value={password}
              placeholder={$_('signup.password_placeholder')}
              required
            />
            {#if password}
              <div class="space-y-2 text-xs">
                <p class="text-muted-foreground">{$_('signup.password_requirements.title')}</p>
                <ul class="list-inside list-disc space-y-1 pl-2">
                  <li
                    class:text-destructive={password.length < 8}
                    class:text-green-500={password.length >= 8}
                  >
                    {$_('signup.password_requirements.min_length')}
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
            {loading ? $_('signup.buttons.creating_account') : $_('signup.buttons.create_account')}
          </Button>
        </form>
      </AuthCard>
    {/if}
  </div>
</div>
