<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import EmailVerification from '$lib/components/email-verification.svelte';
  import AuthCard from '$lib/components/ui/auth-card.svelte';
  import passwordHelpers from '$lib/helpers/password-helpers';
  import { myUserContext } from '$lib/context/my-user-context.svelte';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
  import X from 'lucide-svelte/icons/x';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { MultiStepActionEventType, SidMultiStepActionProgress } from '@baragaun/bg-node-client'

  const { getPasswordError, validatePassword } = passwordHelpers;

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
      <EmailVerification
        {email}
        initialStep="email"
        buttonText="Continue"
        verifyButtonText="Verify"
        loadingText="Sending..."
        verifyingText="Verifying..."
        showSkipButton={true}
        onEmailSubmit={onSubmit}
      />

      <div class="mt-4 text-center text-sm">
        <span class="text-muted-foreground">Already a have an account?</span>
        {' '}
        <Button variant="link" class="px-1 font-normal" href="/signin">Log In</Button>
      </div>
    </AuthCard>
  </div>
</div>
