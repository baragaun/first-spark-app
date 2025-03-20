<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { onDestroy } from 'svelte';
  import { writable, get } from 'svelte/store';
  import OtpVerification from '$lib/components/otp-verification.svelte';
  import { myUserContext } from '@/context/my-user-context.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';

  // Props
  let {
    email = '',
    initialStep = 'email',
    buttonText = 'Continue',
    verifyButtonText = 'Verify',
    loadingText = 'Sending...',
    verifyingText = 'Verifying...',
    showSkipButton = false,
    onEmailSubmit = (email: string) => {},
    onVerify = (code: string) => {},
    onResend = (email: string) => {},
    onBack = (step: string) => {},
    onSkip = () => {},
  } = $props();

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Internal state
  const STEPS = {
    EMAIL: 'email',
    VERIFY: 'verify',
  };

  let currentStep = writable(initialStep === 'verify' ? STEPS.VERIFY : STEPS.EMAIL);
  let loading = $state(false);
  let resendTimer = $state(30); // Timer in seconds
  let canResend = $state(false);
  let timerInterval: ReturnType<typeof setInterval>;
  let checkingEmail = $state(false);
  let emailError = $state('');

  // Track emails that have active cooldowns
  const emailCooldowns = new Map<string, number>();

  // Check if email is available
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const result = await myUserContext.isUserIdentAvailable(email, UserIdentType.email);
      return result.isAvailable ?? false;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
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

  const handleResendCode = async () => {
    if (!canResend) return;

    loading = true;
    try {
      onResend({ email });
      startResendTimer(email);
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      loading = false;
    }
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    // Check if this email has an active cooldown
    if (emailCooldowns.has(email)) {
      const cooldownEnd = emailCooldowns.get(email) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        resendTimer = remainingTime;
        currentStep.set(STEPS.VERIFY);
        return;
      }
    }

    loading = true;
    try {
      onEmailSubmit(email);
      currentStep.set(STEPS.VERIFY);
      startResendTimer(email);
    } catch (error) {
      console.error('Error sending verification code:', error);
    } finally {
      loading = false;
    }
  };

  const handleBack = () => {
    const currentStepValue = get(currentStep);
    onBack({ step: currentStepValue });
    currentStep.set(currentStepValue === STEPS.VERIFY ? STEPS.EMAIL : STEPS.VERIFY);
  };

  const handleSkip = () => {
    onSkip();
  };

  // Start the timer when the component mounts and we're on verify step
  $effect(() => {
    if ($currentStep === STEPS.VERIFY && !timerInterval) {
      startResendTimer(email);
    }
  });

  onDestroy(() => {
    clearInterval(timerInterval);
  });
</script>

{#if $currentStep === STEPS.EMAIL}
  <div class="space-y-4">
    <div class="space-y-2">
      <Input
        type="email"
        placeholder="Enter your email"
        bind:value={email}
        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2}"
        title="Please enter a valid email address"
        required
        onblur={async () => {
          if (email && isValidEmail(email)) {
            checkingEmail = true;
            const isAvailable = await checkEmailAvailability(email);
            checkingEmail = false;
            if (!isAvailable) {
              emailError = 'This email address is already registered.';
            } else {
              emailError = '';
            }
          } else if (!email) {
            // Clear error when input is empty
            emailError = '';
          }
        }}
      />
      {#if email && !isValidEmail(email)}
        <p class="text-xs text-destructive">Please enter a valid email address</p>
      {/if}
      {#if emailError}
        <p class="text-xs text-destructive">{emailError}</p>
      {/if}
    </div>
    <Button
      type="submit"
      class="w-full"
      disabled={loading || checkingEmail || !email || !isValidEmail(email) || emailError !== ''}
      onclick={handleEmailSubmit}
    >
      {loading ? loadingText : buttonText}
    </Button>
  </div>
{:else if $currentStep === STEPS.VERIFY}
  <div class="space-y-4">
    <OtpVerification
      {email}
      {resendTimer}
      {canResend}
      {verifyButtonText}
      {verifyingText}
      onVerify={({ code }) => onVerify({ code })}
      onResend={() => handleResendCode()}
      onBack={handleBack}
    />

    {#if showSkipButton}
      <div class="mt-2 flex justify-end">
        <Button type="button" variant="link" class="text-sm" onclick={handleSkip}>
          Skip verification
        </Button>
      </div>
    {/if}
  </div>
{/if}
