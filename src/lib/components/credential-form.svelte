<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { myUserContext } from '$lib/contexts/my-user-context.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import AuthCard from './ui/auth-card.svelte';
  import PasswordInput from './ui/password-input';
  import passwordHelpers from '@/helpers/password-helpers';

  let password = $state('');
  let username = $state('');
  let checkingUsername = $state(false);
  let loading = $state(false);
  let usernameError = $state('');
  let suggestedHandle = $state('');

  const { getPasswordError, validatePassword } = passwordHelpers;

  // Check if email is available
  const checkUserIdentityAvailability = async (): Promise<boolean> => {
    try {
      const result = await myUserContext.isUserIdentAvailable(username, UserIdentType.userHandle);
      return result.isAvailable ?? false;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  };

  interface Props {
    currentUserName?: string;
    onSubmit?: () => void;
    onBack?: () => void;
  }

  const { currentUserName, onSubmit, onBack }: Props = $props();

  $effect(() => {
    if (currentUserName) {
      username = currentUserName;
    }
  });
</script>

<AuthCard title="Create your Username and Password" showBackButton={true} {onBack}>
  <form onsubmit={onSubmit} class="space-y-4">
    <div class="space-y-2">
      <label for="username" class="text-sm font-medium">Username</label>
      <Input
        type="text"
        placeholder="Username (e.g., CosmoExplorer, PixelPioneer)"
        bind:value={username}
        required
        onblur={async () => {
          if (username) {
            checkingUsername = true;
            usernameError = '';
            const isAvailable = checkUserIdentityAvailability();
            checkingUsername = false;

            if (!isAvailable) {
              usernameError = 'This username is unavailable.';
            }
          }
        }}
      />
      {#if checkingUsername}
        <p class="text-xs text-muted-foreground">Checking username availability...</p>
      {:else if usernameError}
        <p class="text-xs text-destructive">{usernameError}</p>
      {/if}
    </div>
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
      disabled={checkingUsername || loading || !password || !validatePassword(password).isValid}
    >
      {loading ? 'Creating account...' : 'Create Account'}
    </Button>
  </form>
</AuthCard>
