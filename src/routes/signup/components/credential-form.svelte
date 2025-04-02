<script lang="ts">
  import AuthCard from '$lib/components/auth-card.svelte';
  import { Button } from '$lib/components/ui/button';
  import UsernameInput from '@/components/ui/username-input/username-input.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import passwordHelpers from '@/helpers/password-helpers';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import PasswordInput from '../../../lib/components/ui/password-input';

  // State variables
  let password = $state('');
  let username = $state('');
  let loading = $state(false);
  let isUsernameAvailable = $state<boolean | null>(null);

  // Destructure password helpers
  const { getPasswordError, validatePassword } = passwordHelpers;

  // Props interface
  interface Props {
    email?: string;
    onSubmit?: (credentials: { username: string; password: string }) => void;
    onBack?: () => void;
  }

  const { email, onSubmit, onBack }: Props = $props();

  const getSuggestedHandle = async (): Promise<string | null> => {
    if (!email) return '';
    if (myUserContext.myUserHandle) return myUserContext.myUserHandle;

    try {
      const result = await myUserContext.findAvailableUserHandle(email);

      if (result && typeof result === 'object' && 'object' in result) {
        isUsernameAvailable = true;
        return result.object ?? '';
      }

      if (typeof result === 'string') {
        isUsernameAvailable = true;
        return result;
      }
    } catch (error) {
      console.error('Error getting suggested handle:', error);
      isUsernameAvailable = false;
    }

    return '';
  };

  const checkUsernameAvailability = async (ident: string, type: UserIdentType): Promise<void> => {
    // Skip check if it's the current user's handle
    const isCurrentIdent =
      type === UserIdentType.userHandle && ident === myUserContext.myUserHandle;
    if (isCurrentIdent) {
      console.log('isCurrentIdent', { isCurrentIdent });
      isUsernameAvailable = null;
      return;
    }

    try {
      const result = await myUserContext.isUserIdentAvailable(ident, type);
      isUsernameAvailable = result.isAvailable ?? false;
      console.log('checkUsernameAvailability', result.isAvailable);
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      isUsernameAvailable = false;
    }
  };

  // Form submission handler
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(password).isValid;

    if (onSubmit && isPasswordValid && isUsernameAvailable) {
      onSubmit({ username, password });
    }
  };
</script>

<AuthCard
  title="Create your Username and Password"
  description="Choose a unique username and a secure password to complete your account setup."
  showBackButton={true}
  {onBack}
>
  <form onsubmit={handleSubmit} class="space-y-4">
    <UsernameInput
      bind:username
      bind:isUsernameAvailable
      placeholder="Username (e.g., CosmoExplorer, PixelPioneer)"
      checkAvailability={checkUsernameAvailability}
      generateUsername={getSuggestedHandle}
    />

    <div class="relative space-y-2">
      <label for="password" class="text-sm font-medium">Password</label>
      <PasswordInput bind:value={password} placeholder="Password" required />

      {#if password}
        {@const passwordValidation = validatePassword(password)}
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

        {#if getPasswordError(password)}
          <p class="text-xs text-destructive">{getPasswordError(password)}</p>
        {/if}
      {/if}
    </div>

    <Button
      type="submit"
      class="w-full"
      disabled={isUsernameAvailable !== true ||
        loading ||
        !password ||
        !validatePassword(password).isValid}
    >
      {loading ? 'Creating account...' : 'Create Account'}
    </Button>
  </form>
</AuthCard>
