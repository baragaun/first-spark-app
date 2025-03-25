<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { REGEXP_ONLY_DIGITS } from 'bits-ui';
  import AuthCard from './ui/auth-card.svelte';

  interface Props {
    email: string;
    onVerify: (code: string) => void;
    onResend: () => void;
    onBack?: () => void;
  }

  let { email, onResend, onVerify, onBack }: Props = $props();

  // Internal state
  let verificationCode = $state('');
  let loading = $state(false);
  let verificationError = $state('');
  let resendTimer = $state(30);
  let canResend = $state(false);

  let timerInterval: ReturnType<typeof setInterval>;
  //   const emailCooldowns = new Map<string, number>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    loading = true;
    try {
      onResend();
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      loading = false;
    }
  };

  // Handle verification code submission
  const handleVerifySubmit = async () => {
    loading = true;
    verificationError = '';
    try {
      onVerify(verificationCode);
    } catch (error) {
      console.error('Error verifying code:', error);
      verificationError = 'Invalid verification code. Please try again.';
    } finally {
      loading = false;
    }
  };

  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;
    // emailCooldowns.set(email, Date.now() + resendTimer * 1000);

    // after the signUp user will not able to signup again if the discard the process
    // in the middle of account creation

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
        // emailCooldowns.delete(email);
      }
    }, 1000);
  };

  // Start the timer when component mounts
  startResendTimer();
</script>

<AuthCard
  title="Verify your email"
  description={`Enter the six digit code we sent to your email : ${email}`}
>
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="verification-code" class="text-sm font-medium">Enter verification code</label>
      <InputOTP.Root
        id="verification-code"
        maxlength={6}
        bind:value={verificationCode}
        pattern={REGEXP_ONLY_DIGITS}
      >
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
        type="button"
        class="w-full"
        disabled={loading || verificationCode.length < 6}
        onclick={handleVerifySubmit}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
      <div class="flex justify-between text-sm">
        <Button variant="link" class="px-0" onclick={onBack}>Back</Button>
        <Button variant="link" class="px-0" disabled={!canResend} onclick={handleResendCode}>
          {canResend ? 'Resend code' : `Resend in ${formatTime(resendTimer)}`}
        </Button>
      </div>
    </div>
  </div>
</AuthCard>
