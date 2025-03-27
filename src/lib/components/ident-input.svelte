<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { getContext } from 'svelte';
  import { z } from 'zod';

  const myUserContext = getContext<MyUserContext>('myUserContext');

  // State variables
  let isChecking = $state(false);
  let debounceTimer: number | null = null;
  // let identType = $state(UserIdentType.email);
  const DEBOUNCE_DELAY = 300; // ms

  // Define Zod schemas for validation
  const emailSchema = z.string().email('Not a valid email address');
  const handleSchema = z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(30, 'Cannot exceed 30 characters');

  // Check if identifier is available
  const checkIdentAvailability = async (ident: string, type: UserIdentType): Promise<boolean> => {
    try {
      const result = await myUserContext.isUserIdentAvailable(ident, type);
      return result.isAvailable ?? false;
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      return false;
    }
  };

  // Function to validate the current identifier based on its type
  const validateIdentifier = (ident: string): boolean => {
    if (!ident) {
      return false;
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
  }

  let {
    identifier = $bindable(''),
    identError = $bindable(''),
    identType = $bindable(UserIdentType.email),
    placeholder = 'Enter email or username',
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

    // Set up debounced availability check
    isChecking = true;
    debounceTimer = window.setTimeout(async () => {
      try {
        const isAvailable = await checkIdentAvailability(identifier, identType);
        if (!isAvailable) {
          identError = `This ${identType === UserIdentType.email ? 'email address is already registered.' : 'username is unavailable.'}`;
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
  {#if identifier && !validateIdentifier(identifier)}
    <p class="text-xs text-destructive">
      {identType === UserIdentType.email
        ? 'Please enter a valid email address'
        : 'Username must be 3-30 characters'}
    </p>
  {/if}
  {#if identError}
    <p class="text-xs text-destructive">{identError}</p>
  {/if}
</div>
