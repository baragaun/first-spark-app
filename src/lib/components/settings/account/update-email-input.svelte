<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight } from 'lucide-svelte';
  import * as Form from '$lib/components/ui/form/index';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { emailSchema } from '../../../../routes/settings/account/account-settings-schema';

  interface EmailInputProps {
    currentEmail: string;
    onSave: (newEmail: string) => Promise<void>;
    emailForm: SuperValidated<Infer<typeof emailSchema>>;
  }

  let { currentEmail, onSave, emailForm }: EmailInputProps = $props();

  const form = superForm(emailForm, {
    validators: zodClient(emailSchema),
    validationMethod: 'oninput',
    onResult: ({ result }) => {
      isLoading = false;
      if (result.type === 'success') {
        handleEmailChange();
      }
    },
  });

  // Destructure form helpers
  const { form: formData, enhance, validateForm, errors } = form;

  // State variables
  let isLoading = $state(false);
  let showEmailEdit = $state(false);
  let showConfirmation = $state(false);

  // Derived state to check if form has values and is valid
  let hasFormValues = $derived(
    $formData.email && $formData.currentPassword && !$errors.email && !$errors.currentPassword,
  );

  // Reset dialog state when closed
  function resetDialogState() {
    $formData.email = '';
    $formData.currentPassword = '';
    showConfirmation = false;
    if (isLoading) isLoading = false;
  }

  // When opening the dialog, set initial values
  function openDialog() {
    showEmailEdit = true;
    // Initialize form with empty values to avoid validation errors on first render
    $formData.email = '';
    $formData.currentPassword = '';
  }

  // Handle email change
  const handleEmailChange = async () => {
    try {
      await onSave($formData.email);
      showConfirmation = true;
    } catch (error) {
      console.error('Error updating email:', error);
    } finally {
      isLoading = false;
    }
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => openDialog()}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Email</p>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
      {currentEmail}
    </p>
    <ChevronRight
      class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </div>
</button>

<Dialog.Root
  open={showEmailEdit}
  onOpenChange={(open: boolean) => {
    showEmailEdit = open;
    if (!open) resetDialogState();
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    {#if !showConfirmation}
      <Dialog.Header class="space-y-2">
        <Dialog.Title class="text-xl font-semibold">Change email</Dialog.Title>
        <Dialog.Description class="text-base text-muted-foreground">
          Enter your new email address and current password to verify.
        </Dialog.Description>
      </Dialog.Header>

      <form
        method="POST"
        action="?/updateEmail"
        use:enhance={{
          onSubmit: async ({ cancel }) => {
            const result = await validateForm();
            if (!result.valid) {
              cancel();
              return;
            }
            isLoading = true;
          },
        }}
        class="mt-6 space-y-4"
      >
        <div class="rounded-lg border bg-muted/50 p-4">
          <p class="text-sm font-medium text-muted-foreground">Current Email</p>
          <p class="mt-1 text-base">{currentEmail}</p>
        </div>

        <Form.Field {form} name="email">
          <label for="new-email" class="mb-2 block text-sm font-medium leading-none"
            >New Email Address</label
          >
          <Form.Control>
            {#snippet children({ props })}
              <Input
                {...props}
                id="new-email"
                type="email"
                placeholder="new email"
                bind:value={$formData.email}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="currentPassword">
          <label for="email-change-password" class="mb-2 block text-sm font-medium leading-none"
            >Current Password</label
          >
          <Form.Control>
            {#snippet children({ props })}
              <PasswordInput
                {...props}
                id="email-change-password"
                placeholder="password"
                bind:value={$formData.currentPassword}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Dialog.Footer class="mt-6 flex justify-end gap-3">
          <Button variant="outline" type="button" onclick={() => (showEmailEdit = false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !hasFormValues}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </Dialog.Footer>
      </form>
    {:else}
      <!-- Email confirmation screen -->
      <Dialog.Header>
        <Dialog.Title class="text-xl font-semibold">Email verification sent</Dialog.Title>
      </Dialog.Header>
      <div class="mt-6 space-y-4">
        <p class="text-sm text-muted-foreground">
          We've sent a verification link to <span class="font-medium">{$formData.email}</span>.
          Please check your inbox and click the link to verify your new email address.
        </p>
        <Dialog.Footer class="flex justify-end">
          <Button
            variant="outline"
            disabled={isLoading || !hasFormValues}
            onclick={() => {
              showEmailEdit = false;
              showConfirmation = false;
            }}
          >
            Close
          </Button>
        </Dialog.Footer>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
