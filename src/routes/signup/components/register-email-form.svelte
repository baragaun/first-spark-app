<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import EmailInput from '@/components/email-input.svelte';
  import AuthCard from '@/components/auth-card.svelte';

  let loading = $state(false);
  let emailError = $state('');

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
    <EmailInput bind:email bind:emailError />
    <Button
      type="submit"
      class="w-full"
      disabled={loading || !email || emailError !== ''}
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
