<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import AuthCard from '$lib/components/auth-card.svelte';
  import PasswordInput from '../../../lib/components/ui/password-input';
  import passwordHelpers from '@/helpers/password-helpers';
  import IdentInput from '@/components/ident-input.svelte';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { getContext } from 'svelte';

  let password = $state('');
  let username = $state('');
  let checkingUsername = $state(false);
  let loading = $state(false);
  let usernameError = $state('');
  let suggestedHandle = $state('');

  const { getPasswordError, validatePassword } = passwordHelpers;
  const myUserContext = getContext<MyUserContext>('myUserContext');

  // Get suggested username handle
  const getSuggestedHandle = async () => {
    if (!email) return;

    if (myUserContext.myUserHanlde) {
      username = myUserContext.myUserHanlde;
      return;
    }

    try {
      checkingUsername = true;
      const result = await myUserContext.findAvailableUserHandle(email);
      if (typeof result === 'string') {
        suggestedHandle = result;
      }
    } catch (error) {
      console.error('Error getting suggested handle:', error);
    } finally {
      checkingUsername = false;
    }
  };

  $effect(() => {
    if (email) {
      getSuggestedHandle();
    }
  });

  interface Props {
    email?: string;
    onSubmit?: () => void;
    onBack?: () => void;
  }

  const { email, onSubmit, onBack }: Props = $props();
</script>

<AuthCard
  title="Create your Username and Password"
  description="Choose a unique username and a secure password to complete your account setup."
  showBackButton={true}
  {onBack}
>
  <form onsubmit={onSubmit} class="space-y-4">
    <IdentInput
      bind:identifier={username}
      bind:identError={usernameError}
      identType={UserIdentType.userHandle}
      placeholder="Username (e.g., CosmoExplorer, PixelPioneer)"
    />
    {#if suggestedHandle}
      <p class="text-xs text-muted-foreground">
        Suggested username: {suggestedHandle}
      </p>
    {/if}
    <div class="relative space-y-2">
      <label for="password" class="text-sm font-medium">Password</label>
      <PasswordInput bind:value={password} placeholder="Password" required />
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
          </ul>
        </div>
      {/if}
      {#if password && getPasswordError(password)}
        <p class="text-xs text-destructive">{getPasswordError(password)}</p>
      {/if}
    </div>
    <Button
      type="submit"
      class="w-full"
      disabled={checkingUsername ||
        !!usernameError ||
        loading ||
        !password ||
        !validatePassword(password).isValid}
    >
      {loading ? 'Creating account...' : 'Create Account'}
    </Button>
  </form>
</AuthCard>
