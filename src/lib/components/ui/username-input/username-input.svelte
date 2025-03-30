<script lang="ts">
  import * as Form from '$lib/components/ui/form/index';
  import { Input } from '$lib/components/ui/input';
  import { cn } from '$lib/utils.js';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { AlertCircle, Check, RefreshCw } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import type { SuperForm } from 'sveltekit-superforms';

  interface FormData {
    username: string;
    [key: string]: unknown;
  }

  interface UsernameInputProps {
    form: SuperForm<FormData, unknown>;
    name?: string;
    label?: string;
    placeholder?: string;
    showSuggestionButton?: boolean;
    checkAvailability?: (
      ident: string,
      type: UserIdentType,
    ) => Promise<{ isAvailable: boolean; isCurrentIdent: boolean }>;
    generateUsername?: () => Promise<string>;
    currentUsername?: string;
    class?: string;
  }

  let {
    form,
    name = 'username',
    label = 'Username',
    placeholder = 'Enter username',
    showSuggestionButton = true,
    checkAvailability = async () => {
      return { isAvailable: true, isCurrentIdent: false };
    },
    generateUsername = async () => '',
    currentUsername = '',
    class: className = '',
    ...restProps
  }: UsernameInputProps = $props();

  // Extract form components
  const { form: formData, errors } = form;

  // States
  let isChecking = $state(false);
  let isAvailable = $state<boolean | null>(null);
  let isGeneratingSuggestion = $state(false);
  let suggestedUsername = $state('');

  // Generate a username suggestion
  const getSuggestedUsername = async () => {
    try {
      isGeneratingSuggestion = true;
      const suggestion = await generateUsername();
      suggestedUsername = suggestion;
      $formData.username = suggestion;

      // Since we know this is available (we just generated it)
      isAvailable = true;
    } catch (error) {
      console.error('Error generating username suggestion:', error);
    } finally {
      isGeneratingSuggestion = false;
    }
  };

  // Generate a username suggestion on mount if showSuggestionButton is true
  onMount(() => {
    if (showSuggestionButton && !$formData.username) {
      getSuggestedUsername();
    }
  });

  // Check username availability with debounce
  $effect(() => {
    // Skip check if no username or has validation errors
    if (!$formData.username || $errors[name]) {
      isAvailable = null;
      isChecking = false;
      return;
    }

    if ($formData.username === suggestedUsername) {
      isAvailable = true;
      isChecking = false;
      return;
    }

    isChecking = true;

    const timer = window.setTimeout(async () => {
      try {
        const result = await checkAvailability($formData.username, UserIdentType.userHandle);
        isAvailable = result.isAvailable;

        if (result.isCurrentIdent) {
          isAvailable = null;
          isChecking = false;
          return;
        }

        if (isAvailable === true) suggestedUsername = $formData.username;
      } catch (error) {
        console.error('Error checking username:', error);
        isAvailable = false;
      } finally {
        isChecking = false;
      }
    }, 500);

    // Clean up the previous timer when the effect reruns
    return () => {
      clearTimeout(timer);
    };
  });
</script>

<Form.Field {form} {name}>
  <div class="flex items-center justify-between">
    <label for={name} class="text-sm font-medium leading-none">{label}</label>
    {#if showSuggestionButton}
      <Form.Button
        variant="ghost"
        size="sm"
        class="h-8 px-2 text-xs"
        type="button"
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
      </Form.Button>
    {/if}
  </div>
  <Form.Control>
    {#snippet children({ props })}
      <div class="relative">
        <Input
          {...props}
          {...restProps}
          id={name}
          type="text"
          {placeholder}
          class={cn(
            'pr-10',
            isAvailable === false ? 'border-red-500 focus-visible:ring-red-500' : '',
            className,
          )}
          disabled={isGeneratingSuggestion}
          bind:value={$formData.username}
        />
        {#if isGeneratingSuggestion || isChecking}
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <div
              class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
            ></div>
          </div>
        {:else if isAvailable === false}
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500"
          >
            <AlertCircle class="h-4 w-4" />
          </div>
        {:else if isAvailable === true}
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
          >
            <Check class="h-4 w-4" />
          </div>
        {/if}
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
  {#if isAvailable === false}
    <p class="text-xs text-red-500">This username is already taken</p>
  {:else if isAvailable === true}
    <p class="text-xs text-green-500">This username is available!</p>
  {/if}
</Form.Field>
