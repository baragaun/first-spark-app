<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import fsdata from '$lib/services/fsdata/fsdata';
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/components/nav-bar.svelte';

  let identifier = ''; // for email or username
  let loading = false;
  let error = '';
  let verificationCode = '';
  let step = 'email'; // 'email' or 'verify'
  let resendTimer = 30;
  let canResend = false;
  let timerInterval: ReturnType<typeof setInterval>;
  let password = '';
  let confirmPassword = '';
  let resetActionId: string | undefined;
  let resetExpireAt: Date | undefined;

  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
      }
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendCode = async () => {
    loading = true;
    error = '';

    try {
      const response = await fsdata.resetMyPassword(identifier);

      if (!response || !response?.actionProgress) {
        // Silently fail - don't show any error
        // Just stay on the same step
        return;
      }

      resetActionId = response.actionProgress.actionId;
      resetExpireAt = response.actionProgress.expiresAt
        ? new Date(response.actionProgress.expiresAt)
        : undefined;
      console.log('Reset password action started:', { resetActionId, resetExpireAt });

      step = 'verify';
      startResendTimer();
    } catch (err) {
      // Silently fail - don't show any error
      console.error('Error sending verification code:', err);
    } finally {
      loading = false;
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    loading = true;
    try {
      await handleSendCode();
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      loading = false;
    }
  };

  onDestroy(() => {
    clearInterval(timerInterval);
  });

  const handleVerifyAndReset = async () => {
    loading = true;
    error = '';

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      loading = false;
      return;
    }

    try {
      if (!resetActionId) {
        throw new Error('Reset action ID is missing');
      }

      const result = await fsdata.verifyMultiStepActionToken(
        resetActionId,
        verificationCode,
        password,
      );

      if (!result) {
        throw new Error('Failed to verify code and reset password');
      }

      authStore.set({ isAuthenticated: true });
      await goto('/');
    } catch (err) {
      console.error('Error resetting password:', err);
      error =
        err instanceof Error
          ? err.message
          : 'Invalid verification code or password reset failed. Please try again.';
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

<div class="grid flex-1 place-items-center">
  <Card class="relative w-full max-w-md">
    <CardHeader>
      <CardTitle class="text-2xl">Reset your password</CardTitle>
      <CardDescription>
        {#if step === 'email'}
          Enter your email or username to receive a verification code
        {:else if step === 'verify'}
          Enter the verification code we sent to {identifier}
        {:else}
          Enter your new password
        {/if}
      </CardDescription>
    </CardHeader>
    <CardContent>
      {#if error}
        <Alert variant="destructive" class="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      {/if}

      {#if step === 'email'}
        <form on:submit|preventDefault={handleSendCode} class="space-y-4">
          <div class="space-y-2">
            <Input type="text" placeholder="Email or username" bind:value={identifier} required />
          </div>

          <div class="flex items-center justify-between">
            <Button variant="link" class="px-0 font-normal" href="/support">Need help?</Button>
          </div>

          <Button type="submit" class="w-full" disabled={loading}>
            {loading ? 'Sending code...' : 'Send verification code'}
          </Button>
        </form>
      {:else if step === 'verify'}
        <form on:submit|preventDefault={handleVerifyAndReset} class="space-y-4">
          <div class="space-y-2">
            <label for="verification-code" class="text-sm font-medium"> Verification code </label>
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

          <div class="relative space-y-2">
            <Input type="password" placeholder="New password" bind:value={password} required />
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

          <div class="space-y-2">
            <label for="confirm-password" class="text-sm font-medium"> Confirm password </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              bind:value={confirmPassword}
              required
            />
          </div>

          <div class="text-center text-sm text-muted-foreground">
            Didn't receive the code?
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

          <Button
            type="submit"
            class="w-full"
            disabled={loading || verificationCode.length < 6 || !password || !confirmPassword}
          >
            {loading ? 'Resetting password...' : 'Verify and Reset Password'}
          </Button>

          <Button variant="outline" class="w-full" onclick={() => (step = 'email')}>Back</Button>
        </form>
      {:else if step === 'password'}
        <form on:submit|preventDefault={handleVerifyAndReset} class="space-y-4">
          <div class="space-y-2">
            <Input type="password" placeholder="New password" bind:value={password} required />
          </div>
          <div class="space-y-2">
            <Input
              type="password"
              placeholder="Confirm new password"
              bind:value={confirmPassword}
              required
            />
          </div>

          <Button type="submit" class="w-full" disabled={loading}>
            {loading ? 'Resetting password...' : 'Reset password'}
          </Button>

          <Button variant="outline" class="w-full" onclick={() => (step = 'verify')}>Back</Button>
        </form>
      {/if}
    </CardContent>
  </Card>
</div>