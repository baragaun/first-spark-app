<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { AlertCircle, Check } from 'lucide-svelte';
  import {
    emailSchema,
    usernameSchema,
  } from '../../routes/settings/account/account-settings-schema';

  // State variables
  let isChecking = $state(false);
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 300; // ms

  const myUser = $derived(myUserContext.myUser);

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

  const validateIdentifier = (ident: string) => {
    const result = {
      isValid: false,
      message: '',
    };

    if (!ident) return result;
    const isCurrentIdent =
      (identType === UserIdentType.email && identifier === myUserContext.myEmail) ||
      (identType === UserIdentType.userHandle && identifier === myUserContext.myUserHandle);

    if (isIdentAvailable == null && isCurrentIdent) {
      return { ...result, isValid: true };
    }

    const parsed = (
      UserIdentType.email ? emailSchema.shape.email : usernameSchema.shape.username
    ).safeParse(identifier);

    if (!parsed.success) {
      return {
        ...result,
        message:
          identType === UserIdentType.email
            ? 'Please enter a valid email'
            : 'Username must be 3-30 characters',
      };
    }

    if (isIdentAvailable === false) {
      return {
        ...result,
        message:
          identType === UserIdentType.email
            ? 'This email is already registered'
            : 'This username is already taken',
      };
    }

    // Valid username
    return {
      isValid: true,
      message:
        identType === UserIdentType.email
          ? 'This email is available'
          : 'This username is available',
    };
  };

  interface Props {
    identifier: string;
    identType?: UserIdentType;
    isIdentAvailable?: boolean | null;
    placeholder?: string;
    showAvailabilityMessage?: boolean;
  }

  let {
    identifier = $bindable(''),
    isIdentAvailable: isIdentAvailable = $bindable(null),
    identType = $bindable(UserIdentType.email),
    placeholder = 'Enter email or username',
    showAvailabilityMessage = false,
  }: Props = $props();

  // let isIdentAvailable = $state<boolean | null>(null);

  // Combined effect for identifier validation and availability checking
  $effect(() => {
    // Clear any existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    const isCurrentIdent =
      (identType === UserIdentType.email && identifier === myUserContext.myEmail) ||
      (identType === UserIdentType.userHandle && identifier === myUserContext.myUserHandle);

    // Handle empty identifier case
    if (!identifier || isCurrentIdent) {
      isChecking = false;
      isIdentAvailable = null;
      return;
    }

    // Skip check if username doesn't meet basic requirements
    if (
      (UserIdentType.email ? emailSchema.shape.email : usernameSchema.shape.username).safeParse(
        identifier,
      ).success === false
    ) {
      isIdentAvailable = null;
      isChecking = false;
      return;
    }

    isChecking = true;
    const timer = window.setTimeout(async () => {
      try {
        const result = await checkIdentAvailability(identifier, identType);
        if (!result.isAvailable) {
          isIdentAvailable = false;
        } else {
          isIdentAvailable = true;
        }
      } catch (error) {
        console.error('Error checking identifier:', error);
      } finally {
        isChecking = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
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
      class={isIdentAvailable === false ? 'border-red-500 focus-visible:ring-red-500' : ''}
    />

    {#if isChecking}
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
        ></div>
      </div>
    {:else if isIdentAvailable === false}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500"
      >
        <AlertCircle class="h-4 w-4" />
      </div>
    {:else if isIdentAvailable === true}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
      >
        <Check class="h-4 w-4" />
      </div>
    {/if}
  </div>

  {#key identifier}
    {@const validation = validateIdentifier(identifier)}
    <p class="text-xs {validation.isValid ? 'text-green-500' : 'text-red-500'}">
      {validation.message}
    </p>
  {/key}
</div>
