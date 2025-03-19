<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import X from 'lucide-svelte/icons/x';

  // Props
  export let email = '';
  export let verifyButtonText = 'Verify';
  export let verifyingText = 'Verifying...';
  export let resendTimer = 30;
  export let canResend = false;

  // Event callback props
  export let onVerify = (data: { email: string; code: string }) => {};
  export let onResend = (data: { email: string }) => {};
  export let onBack = () => {};

  // Internal state
  let verificationCode = '';
  let loading = false;
  let verificationError = '';

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
      await onVerify({ email, code: verificationCode });
    } catch (error) {
      console.error('Error verifying code:', error);
      verificationError = 'Invalid verification code. Please try again.';
    } finally {
      loading = false;
    }
  };
</script>

<div class="space-y-4">
  {#if verificationError}
    <Alert variant="destructive" class="relative mb-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{verificationError}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        class="absolute right-2 top-2 h-6 w-6 p-0"
        onclick={() => (verificationError = '')}
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </Button>
    </Alert>
  {/if}
  <div class="space-y-2">
    <label for="verification-code" class="text-sm font-medium">Enter verification code</label>
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
      type="button"
      class="w-full"
      disabled={loading || verificationCode.length < 6}
      onclick={handleVerifySubmit}
    >
      {loading ? verifyingText : verifyButtonText}
    </Button>
    <div class="flex justify-between text-sm">
      <Button variant="link" class="px-0" onclick={onBack}>Back</Button>
      <Button variant="link" class="px-0" disabled={!canResend} onclick={handleResendCode}>
        {canResend ? 'Resend code' : `Resend in ${formatTime(resendTimer)}`}
      </Button>
    </div>
  </div>
</div>
