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
  import { t, locale } from '@/i18n';

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
      return t('signup.password_errors.min_length');
    }
    if (
      !(
        validation.hasUpperCase &&
        validation.hasLowerCase &&
        validation.hasNumber &&
        validation.hasSymbol
      )
    ) {
      return t('signup.password_errors.requirements');
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
        {t('signup.buttons.back')}
      </Button>
    {/if}

    {#if $currentStep === STEPS.EMAIL || $currentStep === STEPS.VERIFY}
      <AuthCard
        title={$currentStep === STEPS.EMAIL ? t('signup.title') : t('signup.verify_email_title')}
        description={$currentStep === STEPS.EMAIL
          ? t('signup.terms_agreement')
          : t('signup.verify_code_message', { name: 'John' })}
      >
        <EmailVerification
          bind:email
          initialStep={$currentStep === STEPS.EMAIL ? 'email' : 'verify'}
          buttonText={t('signup.buttons.continue')}
          verifyButtonText={t('signup.buttons.verify')}
          loadingText={t('signup.buttons.sending')}
          verifyingText={t('signup.buttons.verifying')}
          showSkipButton={true}
          onEmailSubmit={() => handleEmailSubmit}
          onVerify={handleVerify}
          onResend={() => handleResend}
          onBack={() => handleBack}
          onSkip={handleSkip}
        />

        {#if $currentStep === STEPS.EMAIL}
          <div class="mt-4 text-center text-sm">
            <span class="text-muted-foreground">{t('signup.have_account')}</span>
            {' '}
            <Button variant="link" class="px-1 font-normal" href="/signin">
              {t('signup.login_link')}
            </Button>
          </div>
        {/if}
      </AuthCard>
    {:else if $currentStep === STEPS.CREDENTIALS}
      <AuthCard
        title={t('signup.create_credentials_title')}
        description={t('signup.username_description')}
        showBackButton={true}
        onBack={() => currentStep.set(STEPS.VERIFY)}
      >
        <form on:submit|preventDefault={handleSignupSubmit} class="space-y-4">
          <div class="space-y-2">
            <Input
              type="text"
              placeholder={t('signup.username_placeholder')}
              bind:value={username}
              required
            />
            <p class="text-xs text-muted-foreground">
              {t('signup.username_suggestions', {
                emailPrefix: email.split('@')[0],
                random1: Math.floor(Math.random() * 1000).toString(),
                random2: Math.floor(Math.random() * 10000).toString(),
              })}
            </p>
          </div>
          <div class="relative space-y-2">
            <PasswordInput
              bind:value={password}
              placeholder={t('signup.password_placeholder')}
              required
            />
            {#if password}
              <div class="space-y-2 text-xs">
                <p class="text-muted-foreground">{t('signup.password_requirements.title')}</p>
                <ul class="list-inside list-disc space-y-1 pl-2">
                  <li
                    class:text-destructive={password.length < 8}
                    class:text-green-500={password.length >= 8}
                  >
                    {t('signup.password_requirements.min_length')}
                  </li>
                  <li
                    class:text-destructive={!/[A-Z]/.test(password)}
                    class:text-green-500={/[A-Z]/.test(password)}
                  >
                    {t('signup.password_requirements.uppercase')}
                  </li>
                  <li
                    class:text-destructive={!/[a-z]/.test(password)}
                    class:text-green-500={/[a-z]/.test(password)}
                  >
                    {t('signup.password_requirements.lowercase')}
                  </li>
                  <li
                    class:text-destructive={!/[0-9]/.test(password)}
                    class:text-green-500={/[0-9]/.test(password)}
                  >
                    {t('signup.password_requirements.number')}
                  </li>
                  <li
                    class:text-destructive={!/[!@#$%^&*(),.?":{}|<>]/.test(password)}
                    class:text-green-500={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
                  >
                    {t('signup.password_requirements.special')}
                  </li>
                </ul>
              </div>
            {/if}
            {#if password && getPasswordError(password)}
              <p class="text-xs text-destructive">{getPasswordError(password)}</p>
            {/if}
          </div>
          <div class="relative space-y-2">
            <PasswordInput
              bind:value={confirmPassword}
              placeholder={t('signup.confirm_password_placeholder')}
              required
            />
            {#if password && confirmPassword && password !== confirmPassword}
              <p class="text-xs text-destructive">t('signup.password_errors.mismatch')</p>
            {/if}
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between space-x-2">
              <label for="age-confirmation" class="text-sm font-medium">
                {t('signup.age_confirmation.label')}
              </label>
              <Switch.Root bind:checked={isAgeConfirmed} id="age-confirmation" />
            </div>
            {#if !isAgeConfirmed}
              <p class="text-xs text-destructive">
                {t('signup.age_confirmation.error')}
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
            {loading ? t('signup.buttons.creating_account') : t('signup.buttons.create_account')}
          </Button>
        </form>
      </AuthCard>
    {/if}
  </div>
</div>
