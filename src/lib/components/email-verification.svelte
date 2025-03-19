<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { onDestroy } from 'svelte';
  import { writable, get } from 'svelte/store';
  import OtpVerification from '$lib/components/otp-verification.svelte';

  // Props
  export let email = '';
  export let initialStep = 'email'; // 'email' or 'verify'
  export let buttonText = 'Continue';
  export let verifyButtonText = 'Verify';
  export let loadingText = 'Sending...';
  export let verifyingText = 'Verifying...';
  export let showSkipButton = false;

  // Event callback props
  export let onEmailSubmit = ( data: {email: string} ) => {};
  export let onVerify = (data: { code: string }) => {};
  export let onResend = (data: { email: string }) => {};
  export let onBack = (data: { step: string }) => {};
  export let onSkip = () => {};

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
  let verificationCode = '';
  let loading = false;
  let verificationError = '';
  let resendTimer = 30; // Timer in seconds
  let canResend = false;
  let timerInterval: ReturnType<typeof setInterval>;

  // Store the original email to detect changes

  // Track emails that have active cooldowns
  const emailCooldowns = new Map<string, number>();

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        currentStep.set(STEPS.VERIFY);
        return;
      }
    }

    loading = true;
    try {
      console.log('handleEmailSubmit', email);
      onEmailSubmit({ email });
      currentStep.set(STEPS.VERIFY);
      startResendTimer(email);
    } catch (error) {
      console.error('Error sending verification code:', error);
    } finally {
      loading = false;
    }
  };

  // Handle verification code submission
  const handleVerifySubmit = async () => {
    loading = true;
    verificationError = '';
    try {
      // Use the onVerify prop instead of dispatching an event
      onVerify({ code: verificationCode });
      // Note: The parent component will handle the navigation
    } catch (error) {
      console.error('Error verifying code:', error);
      verificationError = 'Invalid verification code. Please try again.';
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
  $: if ($currentStep === STEPS.VERIFY && !timerInterval) {
    startResendTimer(email);
  }

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
      />
      {#if email && !isValidEmail(email)}
        <p class="text-xs text-destructive">Please enter a valid email address</p>
      {/if}
    </div>
    <Button
      type="submit"
      class="w-full"
      disabled={loading || !email || !isValidEmail(email)}
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
      verifyButtonText={verifyButtonText}
      verifyingText={verifyingText}
      onVerify={({ code }) => onVerify({ code })}
      onResend={() => handleResendCode()}
      onBack={handleBack}
    />

    {#if showSkipButton}
      <div class="flex justify-end mt-2">
        <Button type="button" variant="link" class="text-sm" onclick={handleSkip}>
          Skip verification
        </Button>
      </div>
    {/if}
  </div>
{/if}
