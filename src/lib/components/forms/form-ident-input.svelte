<script lang="ts" module>
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { m } from '@/paraglide/messages';
  import { cn } from '@/utils';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { AlertCircle, Check, RefreshCw } from 'lucide-svelte';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';

  let {
    form,
    fieldName = 'email',
    placeholder = 'e.g. "student@example.com"',
    label = 'Email address',
    disabled = false,
    identType = UserIdentType.email,
    isLoading = false,
    suggestUsername = undefined,
  } = $props<{
    form: SuperForm<T>;
    fieldName?: FormPathLeaves<T>;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    identType?: UserIdentType;
    isLoading?: boolean;
    suggestUsername?: () => Promise<void>;
  }>();

  const { form: formData, errors } = form;
  const isUserHandle = $derived(identType === UserIdentType.userHandle);
</script>

<Form.Field {form} name={fieldName}>
  <Form.Control>
    {#snippet children({ props })}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex h-6 items-center">
            <Form.Label>{label}</Form.Label>
          </div>

          {#if isUserHandle && suggestUsername && $errors[fieldName]}
            <button
              type="button"
              class={cn(
                'inline-flex h-6 items-center justify-center rounded-md px-2 text-xs font-medium',
                'ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
              onclick={() => suggestUsername()}
            >
              <RefreshCw class={cn('mr-1 h-3 w-3', isLoading && 'animate-spin')} />
              {isLoading ? m['setting.username.generating']() : m['setting.username.suggest_new']()}
            </button>
          {/if}
        </div>
        <div class="relative w-full">
          <Input
            {...props}
            bind:value={$formData[fieldName]}
            class={cn(
              'border-2 transition-all duration-200',
              $errors[fieldName]
                ? 'border-red-500 focus-visible:border-transparent focus-visible:ring-red-500'
                : 'border-gray-300 focus-visible:border-transparent',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
            {placeholder}
            {disabled}
          />
          {#if isUserHandle && $formData[fieldName]}
            {#if isLoading}
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <div
                  class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
                ></div>
              </div>
            {:else if !$errors[fieldName]}
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
              >
                <Check class="h-4 w-4" />
              </div>
            {:else}
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500"
              >
                <AlertCircle class="h-4 w-4" />
              </div>
            {/if}
          {/if}
        </div>
      </div>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
