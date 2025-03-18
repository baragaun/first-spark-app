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
  import Mail from 'lucide-svelte/icons/mail';
  import { _ } from 'svelte-i18n';

  let identifier = ''; // for email or username
  let loading = false;
  let error = '';
  let emailSent = false;
  let resendTimer = 30;
  let canResend = false;
  let timerInterval: ReturnType<typeof setInterval>;

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

  const handleResetPassword = async () => {
    loading = true;
    error = '';

    try {
      // TODO: Implement your reset password logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Simulate email check
      if (identifier.includes('nonexistent')) {
        throw new Error('No account found with this email address');
      }

      emailSent = true;
      startResendTimer();
    } catch (err) {
      console.error('Error resetting password:', err);
      error =
        err instanceof Error ? err.message : 'Unable to process your request. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    loading = true;
    try {
      // TODO: Implement resend logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      startResendTimer();
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

<div class="relative mx-auto flex h-screen items-center justify-center">
  <Card class="relative w-full max-w-md">
    {#if !emailSent}
      <CardHeader>
        <CardTitle class="text-2xl">{$_('reset_password.title')}</CardTitle>
        <CardDescription>{$_('reset_password.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {#if error}
          <Alert variant="destructive" class="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        {/if}
        <form on:submit|preventDefault={handleResetPassword} class="space-y-4">
          <div class="space-y-2">
            <Input
              type="text"
              placeholder={$_('reset_password.form.identifier_placeholder')}
              bind:value={identifier}
              required
            />
          </div>

          <Button type="submit" class="w-full" disabled={loading}>
            {loading
              ? $_('reset_password.buttons.sending_email')
              : $_('reset_password.buttons.send_email')}
          </Button>
          <div class="flex items-center justify-between">
            <Button variant="link" class="px-0 font-normal" href="/support">
              {$_('reset_password.buttons.need_help')}
            </Button>
          </div>
        </form>
      </CardContent>
    {:else}
      <CardHeader>
        <CardTitle class="text-2xl">{$_('reset_password.check_inbox.title')}</CardTitle>
        <CardDescription>
          {$_('reset_password.check_inbox.description', { values: { email: identifier } })}
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
              {$_('reset_password.check_inbox.code_expiration')}
            </AlertDescription>
          </Alert>

          <div class="text-center text-sm text-muted-foreground">
            {$_('reset_password.check_inbox.didnt_get_email')}
            {#if canResend}
              <Button
                variant="link"
                class="px-1 font-normal"
                onclick={handleResendEmail}
                disabled={loading}
              >
                {$_('reset_password.buttons.resend_email')}
              </Button>
            {:else}
              <span
                >{$_('reset_password.buttons.resend_timer', {
                  values: { time: formatTime(resendTimer) },
                })}</span
              >
            {/if}
          </div>

          <Button variant="outline" class="mt-4 w-full" href="/signin">
            {$_('reset_password.buttons.back_to_login')}
          </Button>
        </div>
      </CardContent>
    {/if}
  </Card>
</div>
