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
  import { UserIdentType } from '@baragaun/bg-node-client';
  import dataProvider from '@/services/dataProvider/dataProvider';

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
        await dataProvider.signInUser(
          identifier,
          identifier.includes('@') ? UserIdentType.email : UserIdentType.userHandle,
          password,
        );

        const isAuthenticated = dataProvider.isSignedIn();

        if (isAuthenticated) {
          authStore.set({ isAuthenticated });
          await goto('/');
        } else {
          error = 'Invalid credentials. Please try again.';
        }
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

<div class="grid flex-1 place-items-center">
  <Card class="relative w-full max-w-md">
    {#if !emailSent}
      <CardHeader>
        <CardTitle class="text-2xl">Log In</CardTitle>
        <CardDescription>
          By continuing, you agree to our User Agreement and acknowledge that you understand and
          agree to our Privacy Policy.
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
              placeholder={loginMethod === 'password' ? 'Email or username' : 'Email'}
              bind:value={identifier}
              required
            />
          </div>

          <!-- Login Method Selection -->
          <div class="space-y-2">
            <label for="login-method" class="text-sm font-medium"
              >How would you like to login?</label
            >
            <RadioGroup.Root id="login-method" bind:value={loginMethod} class="flex gap-4">
              <div class="flex items-center space-x-2">
                <RadioGroup.Item value="password" id="password" />
                <label
                  for="password"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Password
                </label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroup.Item value="magic-link" id="magic-link" />
                <label
                  for="magic-link"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Get magic link
                </label>
              </div>
            </RadioGroup.Root>
          </div>

          {#if loginMethod === 'password'}
            <div class="space-y-2">
              <PasswordInput bind:value={password} placeholder="Password" required />
            </div>
            <div class="flex items-center justify-end">
              <Button variant="link" class="px-0 font-normal" href="/reset-password">
                Forgot password?
              </Button>
            </div>
          {/if}

          <Button type="submit" class="w-full" disabled={loading}>
            {#if loginMethod === 'password'}
              {loading ? 'Signing in...' : 'Log In'}
            {:else}
              {loading ? 'Sending magic link...' : 'Send magic link'}
            {/if}
          </Button>

          <div class="text-center text-sm">
            <span class="text-muted-foreground">New to First Spark?</span>
            {' '}
            <Button variant="link" class="px-1 font-normal" href="/signup">Sign Up</Button>
          </div>
        </form>
      </CardContent>
    {:else}
      <CardHeader>
        <CardTitle class="text-2xl">Check your inbox</CardTitle>
        <CardDescription>
          We've sent a magic link to {identifier}
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
              The magic link will expire in 10 minutes. Click the link in the email to sign in.
            </AlertDescription>
          </Alert>

          <div class="text-center text-sm text-muted-foreground">
            Didn't get an email?
            {#if canResend}
              <Button
                variant="link"
                class="px-1 font-normal"
                onclick={handleResendEmail}
                disabled={loading}
              >
                Resend email
              </Button>
            {:else}
              <span>Resend in {formatTime(resendTimer)}</span>
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
            Back to Log In
          </Button>
        </div>
      </CardContent>
    {/if}
  </Card>
</div>
