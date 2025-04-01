<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { REGEXP_ONLY_DIGITS } from 'bits-ui';
  import AuthCard from './auth-card.svelte';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import passwordHelpers from '@/helpers/password-helpers';

  interface Props {
    ident: string;
    onSubmit: (code: string, password?: string) => void;
    onResend: () => void;
    onBack?: () => void;
    showPasswordField?: boolean;
  }

  let { ident, onResend, onSubmit, onBack, showPasswordField = false }: Props = $props();

  // Internal state
  let verificationCode = $state('');
  let password = $state('');
  let loading = $state(false);
  let verificationError = $state('');
  let resendTimer = $state(30);
  let canResend = $state(false);

  let timerInterval: ReturnType<typeof setInterval>;

  const { getPasswordError, validatePassword } = passwordHelpers;

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
      startResendTimer();
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
      if (showPasswordField && !validatePassword(password, ident).isValid) {
        verificationError = 'Please enter a valid password';
        return;
      }
      onSubmit(verificationCode, showPasswordField ? password : undefined);
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
  description={`Enter the six digit code we sent to ${ident}.`}
  showBackButton={true}
  {onBack}
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

    {#if showPasswordField}
      <div class="space-y-2">
        <label for="password" class="text-sm font-medium">Password</label>
        <PasswordInput
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          required
        />
        {#if password}
          <div class="space-y-2 text-xs">
            <p class="text-muted-foreground">Password requirements:</p>
            <ul class="list-inside list-disc space-y-1 pl-2">
              <li
                class:text-destructive={password.length < passwordHelpers.minLength}
                class:text-green-500={password.length >= passwordHelpers.minLength}
              >
                At least {passwordHelpers.minLength} characters
              </li>
            </ul>
          </div>
        {/if}
        {#if password && getPasswordError(password)}
          <p class="text-xs text-destructive">{getPasswordError(password)}</p>
        {/if}
      </div>
    {/if}

    {#if verificationError}
      <p class="text-xs text-destructive">{verificationError}</p>
    {/if}

    <div class="flex flex-col gap-2">
      <Button
        type="button"
        class="w-full"
        disabled={loading ||
          verificationCode.length < 6 ||
          (showPasswordField && (!password || !validatePassword(password, ident).isValid))}
        onclick={handleVerifySubmit}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
      <div class="flex justify-between text-sm">
        <Button variant="link" class="px-0" disabled={!canResend} onclick={handleResendCode}>
          {canResend ? 'Resend code' : `Resend in ${formatTime(resendTimer)}`}
        </Button>
      </div>
    </div>
  </div>
</AuthCard>
