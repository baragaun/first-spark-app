<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import AuthCard from '$lib/components/ui/auth-card.svelte';
  import { myUserContext } from '$lib/context/my-user-context.svelte';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
  import X from 'lucide-svelte/icons/x';
  import { UserIdentType } from '@baragaun/bg-node-client';

  interface Props {
    loading: boolean;
    onSubmit: (email: string) => void;
  }

  // Props
  let {
    loading,
    onSubmit,
  }: Props = $props();

  let email = $state('');
  let error = $state('');
  let checkingEmail = $state(false);
  let emailError = $state('');

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const result = await myUserContext.isUserIdentAvailable(email, UserIdentType.email);
      return result.isAvailable ?? false;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
</script>

<div class="relative mx-auto flex h-screen items-center justify-center">
  <div class="relative w-full max-w-md px-4">
    <AuthCard
      title="Sign Up"
      description="By continuing, you agree to our User Agreement and acknowledge that you understand and agree to our Privacy Policy."
    >
      {#if error}
        <Alert variant="destructive" class="relative mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            class="absolute right-2 top-2 h-6 w-6 p-0"
            onclick={() => (error = '')}
          >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </Button>
        </Alert>
      {/if}
      <div class="space-y-4">
        <div class="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            bind:value={email}
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2}"
            title="Please enter a valid email address"
            required
            onblur={async () => {
          if (email && isValidEmail(email)) {
            checkingEmail = true;
            const isAvailable = await checkEmailAvailability(email);
            checkingEmail = false;
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
          disabled={loading || checkingEmail || !email || !isValidEmail(email) || emailError !== ''}
          onclick={() => onSubmit(email)}
        >
          {loading ? "loading" : "Submit"}
        </Button>
      </div>

      <div class="mt-4 text-center text-sm">
        <span class="text-muted-foreground">Already a have an account?</span>
        {' '}
        <Button variant="link" class="px-1 font-normal" href="/signin">Log In</Button>
      </div>
    </AuthCard>
  </div>
</div>
