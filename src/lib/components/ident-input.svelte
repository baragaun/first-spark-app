<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { z } from 'zod';
  import { getContext } from 'svelte';
  import { AlertCircle, Check } from 'lucide-svelte';

  // State variables
  let isChecking = $state(false);
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 300; // ms
  const myUserContext = getContext<MyUserContext>('myUserContext');

  // Define Zod schemas for validation
  const emailSchema = z.string().email('Not a valid email address');
  const handleSchema = z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(30, 'Cannot exceed 30 characters');

  const checkIdentAvailability = async (
    ident: string,
    type: UserIdentType,
  ): Promise<{ isAvailable: boolean; isCurrentIdent: boolean }> => {
    const isCurrentIdent =
      (type === UserIdentType.email && ident === myUserContext.myEmail) ||
      (type === UserIdentType.userHandle && ident === myUserContext.myUserHandle);

    if (isCurrentIdent) {
      return { isAvailable: true, isCurrentIdent: true };
    }

    try {
      const result = await myUserContext.isUserIdentAvailable(ident, type);
      return { isAvailable: result.isAvailable ?? false, isCurrentIdent: false };
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      return { isAvailable: false, isCurrentIdent: false };
    }
  };

  const validateIdentifier = (ident: string): boolean => {

    if (!ident) {
      return false;
    }

    const isCurrentIdent =
      (identType === UserIdentType.email && ident === myUserContext.myEmail) ||
      (identType === UserIdentType.userHandle && ident === myUserContext.myUserHandle);

    if (isCurrentIdent) {
      return true;
    }

    if (identType === UserIdentType.email) {
      const result = emailSchema.safeParse(ident);
      return result.success;
    } else {
      const result = handleSchema.safeParse(ident);
      return result.success;
    }
  };

  interface Props {
    identifier: string;
    identType?: UserIdentType;
    identError?: string;
    placeholder?: string;
    showAvailabilityMessage?: boolean;
  }

  let {
    identifier = $bindable(''),
    identError = $bindable(''),
    identType = $bindable(UserIdentType.email),
    placeholder = 'Enter email or username',
    showAvailabilityMessage = false,
  }: Props = $props();

  // Combined effect for identifier validation and availability checking
  $effect(() => {
    // Clear any existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    // Handle empty identifier case
    if (!identifier) {
      identError = '';
      isChecking = false;
      return;
    }

    // Skip availability check for invalid identifiers
    if (!validateIdentifier(identifier)) {
      isChecking = false;
      return;
    }

    const isCurrentIdent =
      (identType === UserIdentType.email && identifier === myUserContext.myEmail) ||
      (identType === UserIdentType.userHandle && identifier === myUserContext.myUserHandle);

    if (isCurrentIdent) {
      // Allow using the current identifier without showing errors
      identError = '';
      isChecking = false;
      return;
    }

    isChecking = true;
    debounceTimer = window.setTimeout(async () => {
      try {
        const result = await checkIdentAvailability(identifier, identType);

        if (result.isCurrentIdent) {
          identError = '';
        } else if (!result.isAvailable) {
          identError = `This ${
            identType === UserIdentType.email
              ? 'email address is already registered.'
              : 'username name is already taken.'
          }`;
        } else {
          identError = '';
        }
      } catch (error) {
        console.error('Error checking identifier:', error);
      } finally {
        isChecking = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  });
</script>

<div class="space-y-2">
  <div class="relative">
    <Input
      type="text"
      {placeholder}
      bind:value={identifier}
      title="Please enter a valid email or username"
      required
      class={identError ? 'border-red-500 focus-visible:ring-red-500' : ''}
    />
    {#if isChecking}
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
        ></div>
      </div>
    {:else if identError}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500"
      >
        <AlertCircle class="h-4 w-4" />
      </div>
    {/if}
    {#if showAvailabilityMessage && !isChecking && !identError && identifier && validateIdentifier(identifier)}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
      >
        <Check class="h-4 w-4" />
      </div>
    {/if}
  </div>


  {#if identifier && !validateIdentifier(identifier)}
    <p class="text-xs text-destructive">
      {identType === UserIdentType.email
        ? 'Please enter a valid email address'
        : 'Username must be 3-30 characters'}
    </p>
  {:else if identError}
    <p class="text-xs text-destructive">{identError}</p>
  {:else if identifier && !identError && validateIdentifier(identifier) && !isChecking}
    <p class="text-xs text-green-500">
      {identType === UserIdentType.email ? 'This email is available' : 'This username is available'}
    </p>
  {/if}
</div>

 