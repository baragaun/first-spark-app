<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { onDestroy } from 'svelte';
  import { writable, get } from 'svelte/store';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { userContext } from '@/context/userContext.svelte';

  // Props
  export let email = '';
  export let initialStep = 'email';
  export let buttonText = 'Continue';
  export let verifyButtonText = 'Verify';
  export let loadingText = 'Sending...';
  export let verifyingText = 'Verifying...';
  export let showSkipButton = false;
  export let onSkip = () => {};
  export let onVerificationSuccess = () => {};

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
  let emailError = '';
  let resendTimer = 30; // Timer in seconds
  let canResend = false;
  let timerInterval: ReturnType<typeof setInterval>;
  let actionId: string | undefined;
  let expireAt: Date | undefined;
  let checkingEmail = false;

  // Store the original email to detect changes

  // Track emails that have active cooldowns
  const emailCooldowns = new Map<string, number>();

  // Check if email is available
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const isAvailable = await userContext.isUserIdentAvailable(email, UserIdentType.email);
      return isAvailable ?? false;
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startEmailVerification = async (emailAddress: string) => {
    emailError = '';

    const signUpResponse = await userContext.signUp(undefined, emailAddress, undefined);
    if (!signUpResponse || !signUpResponse?.id) {
      return false;
    }

    const response = await userContext.signInWithToken(emailAddress);
    if (!response || !response?.actionProgress) {
      return false;
    }
    actionId = response.actionProgress.actionId;

    currentStep.set(STEPS.VERIFY);
    startResendTimer(emailAddress);
    return true;
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    loading = true;
    try {
      await startEmailVerification(email);
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      loading = false;
    }
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    emailError = '';

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
      await startEmailVerification(email);
    } catch (error) {
      console.error('Error sending verification code:', error);
      emailError = 'Failed to send verification code';
    } finally {
      loading = false;
    }
  };

  const verifyEmailCode = async (code: string) => {
    const response = await userContext.verifyMultiStepActionToken(
      actionId!, // actionId from previous step
      code, // verification code
      undefined, // newPassword (not needed for email verification)
    );

    return true;
  };

  // Handle verification code submission
  const handleVerifySubmit = async () => {
    loading = true;
    verificationError = '';

    try {
      const success = await verifyEmailCode(verificationCode);
      if (success) {
        // Call the success handler which will trigger the step change in the parent
        onVerificationSuccess();
      } else {
        verificationError = 'Invalid verification code. Please try again.';
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      verificationError = 'Invalid verification code. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleBack = () => {
    const currentStepValue = get(currentStep);
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
        title="Please enter a valid email address"
        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2}$"
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
      {#if checkingEmail}
        Checking email...
      {:else if loading}
        {loadingText}
      {:else}
        {buttonText}
      {/if}
    </Button>
  </div>
{:else if $currentStep === STEPS.VERIFY}
  <div class="space-y-4">
    {#if verificationError}
      <Alert variant="destructive" class="mb-4">
        <AlertDescription>{verificationError}</AlertDescription>
      </Alert>
    {/if}
    <div class="space-y-2">
      <label for="verification-code" class="text-sm font-medium"> Enter verification code </label>
      <InputOTP.Root maxlength={6} bind:value={verificationCode}>
        {#snippet children({ cells })}
          <InputOTP.Group>
            {#each cells as cell}
              <InputOTP.Slot {cell} />
            {/each}
          </InputOTP.Group>
        {/snippet}
      </InputOTP.Root>
    </div>
    <div class="flex flex-col gap-2">
      <Button
        type="submit"
        class="w-full"
        disabled={loading || verificationCode.length < 6}
        onclick={handleVerifySubmit}
      >
        {loading ? verifyingText : verifyButtonText}
      </Button>

      <div class="text-center text-sm text-muted-foreground">
        Didn't get an email?
        {#if canResend}
          <Button
            variant="link"
            class="px-1 font-normal"
            onclick={handleResendCode}
            disabled={loading}
          >
            Resend code
          </Button>
        {:else}
          <span>Resend in {formatTime(resendTimer)}</span>
        {/if}
      </div>

      <div class="flex items-center justify-between">
        <button
          type="button"
          class="text-sm text-muted-foreground hover:text-primary"
          on:click={handleBack}
        >
          Change email
        </button>

        {#if showSkipButton}
          <Button type="button" variant="link" class="text-sm" onclick={handleSkip}>
            Skip verification
          </Button>
        {/if}
      </div>
    </div>
  </div>
{/if}
