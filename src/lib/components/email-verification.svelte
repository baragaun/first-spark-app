<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { myUserContext } from '@/context/my-user-context.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import AuthCard from './ui/auth-card.svelte';

  let loading = $state(false);
  let emailError = $state('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Check if email is available
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const result = await myUserContext.isUserIdentAvailable(email, UserIdentType.email);
      return result.isAvailable ?? false;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  };

  interface Props {
    email: string;
    onEmailSubmit: (email: string) => void;
  }

  let { email = $bindable(), onEmailSubmit }: Props = $props();
</script>

<AuthCard
  title="Sign Up"
  description="By continuing, you agree to our User Agreement and acknowledge that you understand and agree to our Privacy Policy."
>
  <div class="space-y-4">
    <div class="space-y-4">
      <div class="space-y-2">
        <Input
          type="email"
          placeholder="Enter your email"
          bind:value={email}
          title="Please enter a valid email address"
          required
          onblur={async () => {
            if (email && isValidEmail(email)) {
              loading = true;
              const isAvailable = await checkEmailAvailability(email);
              loading = false;
              if (!isAvailable) {
                emailError = 'This email address is already registered.';
              } else {
                emailError = '';
              }
            } else if (!email) {
              // Clear error when input is empty
              emailError = '';
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
        disabled={loading || !email || !isValidEmail(email) || emailError !== ''}
        onclick={() => onEmailSubmit(email)}
      >
        Continue
      </Button>
    </div>
  </div>
</AuthCard>
