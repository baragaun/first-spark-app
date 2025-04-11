<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { cn } from '$lib/utils.js';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { AlertCircle, Check, RefreshCw } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { type SuperForm } from 'sveltekit-superforms/client';

  let {
    form,
    fieldName = 'username',
    label = 'Username',
    showSuggestionButton = false,
    isUsernameAvailable = null,
    checkAvailability = async (ident: string, type: UserIdentType) => {},
    generateUsername = async () => null,
    currentUsername = '',
  } = $props<{
    form: SuperForm<any, any>;
    fieldName?: string;
    label?: string;
    showSuggestionButton?: boolean;
    isUsernameAvailable?: boolean | null;
    checkAvailability?: (ident: string, type: UserIdentType) => Promise<void>;
    generateUsername?: () => Promise<string | null>;
    currentUsername?: string;
  }>();

  const { form: formData, errors } = form;

  let isChecking = $state(false);
  let isGeneratingSuggestion = $state(false);

  const getSuggestedUsername = async () => {
    if (isGeneratingSuggestion) return;

    try {
      isGeneratingSuggestion = true;
      const suggestion = await generateUsername();
      if (suggestion) {
        isUsernameAvailable = true;
        $formData[fieldName] = suggestion;
      }
    } catch (error) {
      console.error('Error generating username suggestion:', error);
    } finally {
      isGeneratingSuggestion = false;
    }
  };

  onMount(() => {
    if (!$formData[fieldName]) {
      getSuggestedUsername();
    }
  });

  $effect(() => {
    showSuggestionButton = isUsernameAvailable === false;
  });

  $effect(() => {
    // Skip check if no username or has validation errors
    if (!$formData[fieldName] || $formData[fieldName] === currentUsername) {
      isUsernameAvailable = null;
      isChecking = false;
      return;
    }

    // Skip check if username doesn't meet basic requirements
    if ($errors[fieldName]) {
      isUsernameAvailable = null;
      isChecking = false;
      return;
    }

    isChecking = true;
    const timer = window.setTimeout(async () => {
      try {
        await checkAvailability($formData[fieldName], UserIdentType.userHandle);
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

    if (!ident || $errors[fieldName]) return result;

    if (ident === currentUsername) return { ...result, isValid: true };

    if (isUsernameAvailable === false) {
      return {
        ...result,
        message: 'This username is already taken',
      };
    }

    return {
      isValid: true,
      message: 'This username is available',
    };
  };
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Form.Label
            class={cn(
              'text-sm font-medium',
              isUsernameAvailable === false ? 'text-destructive' : '',
            )}>{label}</Form.Label
          >
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
            {...props}
            id={fieldName}
            type="text"
            class={cn('pr-10')}
            disabled={isGeneratingSuggestion}
            bind:value={$formData[fieldName]}
          />
          {#if isGeneratingSuggestion || isChecking}
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div
                class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
              ></div>
            </div>
          {:else if isUsernameAvailable !== null}
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 {isUsernameAvailable
                ? 'text-green-500'
                : 'text-red-500'}"
            >
              {#if isUsernameAvailable}
                <Check class="h-4 w-4" />
              {:else}
                <AlertCircle class="h-4 w-4" />
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/snippet}
  </Form.Control>

  <div class="mt-2">
    {#if $errors[fieldName]}
      <Form.FieldErrors class="text-xs text-destructive" />
    {:else}
      {#key $formData[fieldName]}
        {@const validation = validateIdentifier($formData[fieldName])}
        {#if validation.message}
          <p class="text-xs {validation.isValid ? 'text-green-500' : 'text-destructive'}">
            {validation.message}
          </p>
        {/if}
      {/key}
    {/if}
  </div>
</Form.Field>
