<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import AuthCard from '@/components/auth-card.svelte';
  import IdentInput from '@/components/ident-input.svelte';

  let loading = $state(false);
  let emailError = $state('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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
    <IdentInput
      bind:identifier={email}
      bind:identError={emailError}
      placeholder="Enter your email"
    />
    <Button
      type="submit"
      class="w-full"
      disabled={loading || emailError !== '' || !email || !isValidEmail(email)}
      onclick={() => onEmailSubmit(email)}
    >
      Continue
    </Button>
    <div class="mt-4 text-center text-sm">
      Already have an account?
      <a href="/signin" class="font-medium text-primary underline">Sign in</a>
    </div>
  </div>
</AuthCard>
