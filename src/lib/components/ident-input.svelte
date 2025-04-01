<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { z } from 'zod';
  import { getContext } from 'svelte';

  // State variables
  let isChecking = $state(false);
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 300; // ms
  const myUserContext = getContext<MyUserContext>('myUserContext');
  let autoDetectedType = $state(UserIdentType.email);

  // Define Zod schemas for validation
  const emailSchema = z.string().email('Not a valid email address');
  const handleSchema = z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(30, 'Cannot exceed 30 characters');

  // Function to determine identifier type using Zod
  const determineIdentifierType = (value: string): UserIdentType => {
    // Try to validate as email first
    const emailResult = emailSchema.safeParse(value);
    if (emailResult.success) {
      return UserIdentType.email;
    }

    // Then try to validate as handle
    const handleResult = handleSchema.safeParse(value);
    if (handleResult.success) {
      return UserIdentType.userHandle;
    }

    // Default to email if unclear (validation will catch errors later)
    return UserIdentType.email;
  };

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

  const validateIdentifier = (ident: string, type: UserIdentType): boolean => {
    if (!ident) {
      return false;
    }

    const isCurrentIdent =
      (type === UserIdentType.email && ident === myUserContext.myEmail) ||
      (type === UserIdentType.userHandle && ident === myUserContext.myUserHandle);

    if (isCurrentIdent) {
      return true;
    }

    if (type === UserIdentType.email) {
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
    autoDetect?: boolean;
    skipAvailabilityCheck?: boolean;
  }

  let {
    identifier = $bindable(''),
    identError = $bindable(''),
    identType = $bindable(undefined),
    placeholder = 'Enter email or username',
    autoDetect = false,
    skipAvailabilityCheck = false,
  }: Props = $props();

  // Auto-detect identifier type when not explicitly provided
  $effect(() => {
    if (autoDetect && identifier && identType === undefined) {
      autoDetectedType = determineIdentifierType(identifier);
    }
  });

  // Get the effective type (either provided or auto-detected)
  const getEffectiveType = (): UserIdentType => {
    return identType !== undefined ? identType : autoDetectedType;
  };

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

    const effectiveType = getEffectiveType();

    // Check format validation first
    if (!validateIdentifier(identifier, effectiveType)) {
      isChecking = false;
      identError =
        identType !== undefined
          ? effectiveType === UserIdentType.email
            ? 'Please enter a valid email address'
            : 'Username must be 3-30 characters'
          : 'Please enter a valid email address or username';
      return;
    } else {
      identError = '';
    }

    // If skipAvailabilityCheck is true, only validate format but don't check availability
    if (skipAvailabilityCheck) {
      isChecking = false;
      identError = '';
      return;
    }

    const isCurrentIdent =
      (effectiveType === UserIdentType.email && identifier === myUserContext.myEmail) ||
      (effectiveType === UserIdentType.userHandle && identifier === myUserContext.myUserHandle);

    if (isCurrentIdent) {
      // Allow using the current identifier without showing errors
      identError = '';
      isChecking = false;
      return;
    }

    isChecking = true;
    debounceTimer = window.setTimeout(async () => {
      try {
        const result = await checkIdentAvailability(identifier, effectiveType);

        if (result.isCurrentIdent) {
          identError = '';
        } else if (!result.isAvailable) {
          identError = `This ${
            effectiveType === UserIdentType.email
              ? 'email address is already registered.'
              : 'username is unavailable.'
          }`;
        } else {
          identError = '';
        }
      } catch (error) {
        console.error('Error checking identifier:', error);
        identError = 'Error checking availability';
      } finally {
        isChecking = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  });
</script>

<div class="space-y-2">
  <Input
    type="text"
    {placeholder}
    bind:value={identifier}
    title="Please enter a valid email or username"
    required
    class={identError ? 'border-red-500 focus-visible:ring-red-500' : ''}
  />
  {#if isChecking}
    <p class="text-xs text-muted-foreground">Checking availability...</p>
  {/if}
  {#if identError}
    <p class="text-xs text-destructive">{identError}</p>
  {/if}
</div>
