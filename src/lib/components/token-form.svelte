<script lang="ts" module>
  import { z } from 'zod';

  export const otpFormSchema = z.object({
    emailOtp: z.string().min(6, {
      message: 'Your one-time password must be at least 6 characters.',
    }),
  });

  export type OTPFormSchema = typeof otpFormSchema;
</script>

<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  // import * as Form from "$lib/components/ui/form/index.js";
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { REGEXP_ONLY_DIGITS } from 'bits-ui';
  import { LoaderCircle } from 'lucide-svelte';
  // import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  // import { zod } from 'sveltekit-superforms/adapters';

  interface Props {
    verificationCode: string;
    disabled: boolean;
    onSubmit: (code: string) => void;
    onResend: () => void;
  }

  let { verificationCode = $bindable(), disabled, onSubmit, onResend }: Props = $props();

  let processing = $state(false);
  let verificationError = $state('');
  let resendTimer = $state(30);
  let canResend = $state(false);

  let timerInterval: ReturnType<typeof setInterval>;

  // const form = superForm({
  // 	dataType: 'json',  // No need for hidden fields with dataType: 'json'
  //   validators: zod(otpFormSchema),
  //   resetForm: false,
  // }) ;

  // const { enhance, delayed, validateForm, options } = form;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    processing = true;
    try {
      onResend();
      startResendTimer();
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      processing = false;
    }
  };

  // Handle verification code submission
  const handleVerifySubmit = async () => {
    if (verificationCode.length < 6 || processing) return;
    processing = true;
    verificationError = '';
    try {
      onSubmit(verificationCode);
    } catch (error) {
      console.error('Error verifying code:', error);
      verificationError = 'Invalid verification code. Please try again.';
    } finally {
      processing = false;
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

<div class="space-y-4">
  <div class="space-y-2">
    <InputOTP.Root
      id="verification-code"
      maxlength={6}
      bind:value={verificationCode}
      pattern={REGEXP_ONLY_DIGITS}
    >
      {#snippet children({ cells })}
        <InputOTP.Group class="w-full">
          {#each cells as cell}
            <InputOTP.Slot {cell} />
          {/each}
        </InputOTP.Group>
      {/snippet}
    </InputOTP.Root>
  </div>

  {#if verificationError}
    <p class="text-xs text-destructive">{verificationError}</p>
  {/if}

  <Button
    class="w-full"
    disabled={disabled || processing || verificationCode.length < 6}
    onclick={handleVerifySubmit}
  >
    {#if processing}
      <LoaderCircle class="animate-spin" />
      Verifying code...
    {:else}
      Verify my email
    {/if}
  </Button>
  <div class="flex justify-between text-sm">
    <Button variant="link" class="px-0" disabled={!canResend} onclick={handleResendCode}>
      {canResend ? 'Resend code' : `Resend in ${formatTime(resendTimer)}`}
    </Button>
  </div>
</div>
