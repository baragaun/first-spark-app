<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '@/components/ui/label';
  // import { PasswordInput } from '$lib/components/ui/password-input';
  import * as Card from '$lib/components/ui/card';
  import { goto } from '$app/navigation';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  let identifier = $state(''); // either an email or a username
  let identType = UserIdentType.email; // either an email or a username

  let email = $state('');
  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');

  let error = '';
  let emailSent = false;
  let resendTimer = 30;
  let canResend = false;
  let timerInterval: ReturnType<typeof setInterval>;

  // Track emails that have active cooldowns
  // const emailCooldowns = new Map<string, number>();

  let showPasswordInput = $state(false);
  function togglePasswordInput() {
    showPasswordInput = !showPasswordInput;
  }

  const handleSignIn = async () => {
    loading = true;
    error = '';

    try {
      console.log('trying to sign in');
      // if (showPasswordInput && password) {
      console.log('signing in: ', identifier);
      const user = await myUserContext.signIn(identifier, identType, password);
      console.log('handleSignIn.user: ', user);
      if (user.myUser) {
        await goto('/');
      } else {
        error = 'Invalid credentials. Please try again.';
      }
      // } else {
      // console.log('handle token sign in')
      // await handleTokenSignIn();
      // }
    } catch (err) {
      console.error('Error signing in:', err);
      error = 'Invalid credentials. Please try again.';
    } finally {
      loading = false;
    }
  };

  // const handleTokenSignIn = async () => {
  //   // Check if this email has an active cooldown
  //   if (emailCooldowns.has(identifier)) {
  //     const cooldownEnd = emailCooldowns.get(identifier) || 0;
  //     const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

  //     if (remainingTime > 0) {
  //       // If same email and cooldown active, just show verification screen with current timer
  //       resendTimer = remainingTime;
  //       emailSent = true;
  //       return;
  //     }
  //   }

  //   loading = true;
  //   error = '';

  //   try {
  //     // TODO: Implement your magic link email sending logic here
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
  //     emailSent = true;
  //     startResendTimer(identifier);
  //   } catch (err) {
  //     console.error('Error sending magic link:', err);
  //     error = 'Failed to send magic link. Please try again.';
  //     throw err;
  //   } finally {
  //     loading = false;
  //   }
  // };

  // const startResendTimer = (emailAddress: string) => {
  //   resendTimer = 30;
  //   canResend = false;
  //   emailCooldowns.set(emailAddress, Date.now() + resendTimer * 1000);

  //   clearInterval(timerInterval);
  //   timerInterval = setInterval(() => {
  //     resendTimer -= 1;
  //     if (resendTimer <= 0) {
  //       clearInterval(timerInterval);
  //       canResend = true;
  //       emailCooldowns.delete(emailAddress);
  //     }
  //   }, 1000);
  // };
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign In</Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">Email or Username</Label>
        <Input
          bind:value={identifier}
          id="email"
          type="email"
          placeholder="me@example.com, myusername"
          required
        />
      </div>

      {#if showPasswordInput}
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="/reset-password" class="ml-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
      {/if}

      <Button type="submit" class="w-full" onclick={handleSignIn}>Sign in</Button>

      {#if !showPasswordInput}
        <Button variant="outline" class="w-full" onclick={togglePasswordInput}>
          Sign in with password
        </Button>
      {/if}
    </div>
    {#if showPasswordInput}
      <div class="mt-4 text-center text-sm">
        <Button variant="link" onclick={togglePasswordInput} class="underline">
          Sign in with your email
        </Button>
      </div>
    {/if}
    <div class="mt-4 text-center text-sm">
      Don't have an account?
      <a href="/signup" class="underline"> Sign up </a>
    </div>
  </Card.Content>
</Card.Root>
