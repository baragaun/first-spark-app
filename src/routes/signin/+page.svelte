<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { goto } from '$app/navigation';
  import * as RadioGroup from '$lib/components/ui/radio-group';
  import { authStore } from '$lib/components/nav-bar.svelte';
  import Mail from 'lucide-svelte/icons/mail';
  import { _ } from 'svelte-i18n';

  let identifier = ''; // for email or username
  let password = '';
  let loading = false;
  let error = '';
  let emailSent = false;
  let loginMethod = 'password'; // default to password login
  let resendTimer = 30;
  let canResend = false;
  let timerInterval: ReturnType<typeof setInterval>;

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

  const handleSignIn = async () => {
    loading = true;
    error = '';

    try {
      if (loginMethod === 'password') {
        // TODO: Implement your password signin logic here
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        localStorage.setItem('authToken', 'your-auth-token');
        authStore.set({ isAuthenticated: true }); // Update auth store
        await goto('/');
      } else {
        await handleMagicLinkSignIn();
      }
    } catch (err) {
      console.error('Error signing in:', err);
      error = 'Invalid credentials. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleMagicLinkSignIn = async () => {
    // Check if this email has an active cooldown
    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        emailSent = true;
        return;
      }
    }

    loading = true;
    error = '';

    try {
      // TODO: Implement your magic link email sending logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      emailSent = true;
      startResendTimer(identifier);
    } catch (err) {
      console.error('Error sending magic link:', err);
      error = 'Failed to send magic link. Please try again.';
      throw err;
    } finally {
      loading = false;
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    loading = true;
    try {
      // Check cooldown again just to be safe
      if (emailCooldowns.has(identifier)) {
        const cooldownEnd = emailCooldowns.get(identifier) || 0;
        const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);
        if (remainingTime > 0) {
          resendTimer = remainingTime;
          return;
        }
      }

      await handleMagicLinkSignIn();
    } catch (error) {
      console.error('Error resending email:', error);
    } finally {
      loading = false;
    }
  };

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    clearInterval(timerInterval);
  });
</script>

<div class="relative mx-auto flex h-screen items-center justify-center px-4">
  <Card class="relative w-full max-w-md">
    {#if !emailSent}
      <CardHeader>
        <CardTitle class="text-2xl">{$_('signin.buttons.continue')}</CardTitle>
        <CardDescription>
          {$_('signin.terms_agreement')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {#if error}
          <Alert variant="destructive" class="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        {/if}

        <form on:submit|preventDefault={handleSignIn} class="space-y-4">
          <div class="space-y-2">
            <Input
              type="text"
              placeholder={loginMethod === 'password'
                ? $_('signin.username_or_email_placeholder')
                : $_('signin.email_placeholder')}
              bind:value={identifier}
              required
            />
          </div>

          <!-- Login Method Selection -->
          <div class="space-y-2">
            <label for="login-method" class="text-sm font-medium">{$_('signin.auth_method')}</label>
            <RadioGroup.Root id="login-method" bind:value={loginMethod} class="flex gap-4">
              <div class="flex items-center space-x-2">
                <RadioGroup.Item value="password" id="password" />
                <label
                  for="password"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {$_('signin.auth_method1')}
                </label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroup.Item value="magic-link" id="magic-link" />
                <label
                  for="magic-link"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {$_('signin.auth_method2')}
                </label>
              </div>
            </RadioGroup.Root>
          </div>

          {#if loginMethod === 'password'}
            <div class="space-y-2">
              <PasswordInput
                bind:value={password}
                placeholder={$_('signin.password_placeholder')}
                required
              />
            </div>
            <div class="flex items-center justify-end">
              <Button variant="link" class="px-0 font-normal" href="/reset-password">
                {$_('signin.forgot_password')}
              </Button>
            </div>
          {/if}

          <Button type="submit" class="w-full" disabled={loading}>
            {#if loginMethod === 'password'}
              {loading ? $_('signin.buttons.authenticating') : $_('signin.buttons.continue')}
            {:else}
              {loading ? $_('signin.buttons.sending') : $_('signin.buttons.continue_otp')}
            {/if}
          </Button>

          <div class="text-center text-sm">
            <span class="text-muted-foreground">{$_('signin.have_account')}</span>
            {' '}
            <Button variant="link" class="px-1 font-normal" href="/signup"
              >{$_('signin.buttons.signup')}</Button
            >
          </div>
        </form>
      </CardContent>
    {:else}
      <CardHeader>
        <CardTitle class="text-2xl">{$_('signin.otp_title')}</CardTitle>
        <CardDescription>
          {$_('signin.otp_subtitle')}{identifier}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col items-center space-y-4">
          <!-- Email waiting illustration -->
          <div class="mb-4 h-32 w-32">
            <Mail class="h-full w-full text-muted-foreground" />
          </div>

          <Alert class="mb-4">
            <AlertDescription>
              {$_('signin.otp_expiration')}
            </AlertDescription>
          </Alert>

          <div class="text-center text-sm text-muted-foreground">
            {$_('signin.otp_renewal')}
            {#if canResend}
              <Button
                variant="link"
                class="px-1 font-normal"
                onclick={handleResendEmail}
                disabled={loading}
              >
                {$_('signin.buttons.resend_otp')}
              </Button>
            {:else}
              <span>{$_('signin.otp_timer')}{formatTime(resendTimer)}</span>
            {/if}
          </div>

          <Button
            variant="outline"
            class="mt-4 w-full"
            onclick={() => {
              emailSent = false;
              error = '';
            }}
          >
            {$_('signin.buttons.back')}
          </Button>
        </div>
      </CardContent>
    {/if}
  </Card>
</div>
