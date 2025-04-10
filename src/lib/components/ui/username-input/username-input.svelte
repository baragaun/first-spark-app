<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { cn } from '$lib/utils.js';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { AlertCircle, Check, RefreshCw } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { usernameSchema } from '../../../../routes/settings/account/account-settings-schema';

  interface UsernameInputProps {
    username: string;
    label?: string;
    placeholder?: string;
    showSuggestionButton?: boolean;
    isUsernameAvailable?: boolean | null;
    checkAvailability?: (ident: string, type: UserIdentType) => Promise<void>;
    generateUsername?: () => Promise<string | null>;
    currentUsername?: string;
    class?: string;
  }

  let {
    username = $bindable(''),
    label = 'Username',
    placeholder = 'Enter username',
    isUsernameAvailable = $bindable(true),
    showSuggestionButton = $bindable(false),
    checkAvailability = async () => {},
    generateUsername = async () => null,
    currentUsername = '',
    class: className = '',
    ...restProps
  }: UsernameInputProps = $props();

  let isChecking = $state(false);
  let isGeneratingSuggestion = $state(false);

  const getSuggestedUsername = async () => {
    if (isGeneratingSuggestion) return;

    try {
      isGeneratingSuggestion = true;
      const suggestion = await generateUsername();
      if (suggestion) {
        isUsernameAvailable = true;
        username = suggestion;
      }
    } catch (error) {
      console.error('Error generating username suggestion:', error);
    } finally {
      isGeneratingSuggestion = false;
    }
  };

  onMount(() => {
    if (!username) {
      getSuggestedUsername();
    }
  });

  $effect(() => {
    showSuggestionButton = isUsernameAvailable === false;
  });

  $effect(() => {
    // Skip check if no username or has validation errors
    if (!username || username === currentUsername) {
      isUsernameAvailable = null;
      isChecking = false;
      return;
    }

    // Skip check if username doesn't meet basic requirements
    if (usernameSchema.shape.username.safeParse(username).success === false) {
      isUsernameAvailable = null;
      isChecking = false;
      return;
    }

    isChecking = true;

    const timer = window.setTimeout(async () => {
      try {
        await checkAvailability(username, UserIdentType.userHandle);
      } catch (error) {
        console.error('Error checking username:', error);
        isUsernameAvailable = false;
      } finally {
        isChecking = false;
      }
    }, 300);

    return () => clearTimeout(timer);
  });

  const validateIdentifier = (ident: string) => {
    const result = {
      isValid: false,
      message: '',
    };

    if (!ident) return result;

    if (ident === currentUsername) return { ...result, isValid: true };

    const parsed = usernameSchema.shape.username.safeParse(ident);
    if (!parsed.success) {
      return { ...result, message: 'Username must be 3-30 characters' };
    }

    if (isUsernameAvailable === false) {
      return {
        ...result,
        message: 'This username is already taken',
      };
    }

    // Valid username
    return {
      isValid: true,
      message: 'This username is available',
    };
  };
</script>

<div class="space-y-2">
  <div class="flex items-center justify-between">
    <label for="username" class="text-sm font-medium leading-none">{label}</label>
    {#if showSuggestionButton}
      <button
        type="button"
        class="inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        disabled={isGeneratingSuggestion}
        onclick={getSuggestedUsername}
      >
        {#if isGeneratingSuggestion}
          <RefreshCw class="mr-1 h-3 w-3 animate-spin" />
          Generating...
        {:else}
          <RefreshCw class="mr-1 h-3 w-3" />
          Suggest new
        {/if}
      </button>
    {/if}
  </div>
  <div class="relative">
    <Input
      {...restProps}
      id="username"
      type="text"
      {placeholder}
      class={cn(
        'pr-10',
        isUsernameAvailable === false ? 'border-red-500 focus-visible:ring-red-500' : '',
        className,
      )}
      disabled={isGeneratingSuggestion}
      bind:value={username}
    />
    {#if isGeneratingSuggestion || isChecking}
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
        ></div>
      </div>
    {:else if isUsernameAvailable === false}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500"
      >
        <AlertCircle class="h-4 w-4" />
      </div>
    {:else if isUsernameAvailable === true}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
      >
        <Check class="h-4 w-4" />
      </div>
    {/if}
  </div>

  {#key username}
    {@const validation = validateIdentifier(username)}
    <p class="text-xs {validation.isValid ? 'text-green-500' : 'text-red-500'}">
      {validation.message}
    </p>
  {/key}
</div>
