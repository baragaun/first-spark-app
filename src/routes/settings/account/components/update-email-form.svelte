<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import IdentInput from '@/components/ident-input.svelte';
  import { Label } from '@/components/ui/label';
  import type { Infer, SuperForm } from 'sveltekit-superforms';
  import type { emailSchema } from '../../../../routes/settings/account/account-settings-schema';
  import { UserIdentType } from '@baragaun/bg-node-client';

  interface UpdateEmailFormProps {
    form: SuperForm<Infer<typeof emailSchema>, unknown>;
    isLoading: boolean;
    isPasswordValid: boolean;
    hasFormValues: boolean | string;
    onCancel: () => void;
    onSave: () => void;
  }

  let {
    form,
    isLoading,
    isPasswordValid = $bindable(false),
    hasFormValues = $bindable(false),
    onCancel,
    onSave,
  }: UpdateEmailFormProps = $props();

  let newEmail = $state('');
  let currentPassword = $state('');
  let errorMessage = $state('');
  // $errors.email?.[0]

  // Destructure form helpers
  const { form: formData, errors, enhance } = form;

  // Derive form validity
  let formIsValid = $derived(
    //   $formData.email &&
    //   $formData.currentPassword &&
    newEmail && !errorMessage && currentPassword && !$errors.email && isPasswordValid,
  );
</script>

<form method="POST" use:enhance>
  <div class="space-y-4">
    <div class="space-y-2">
      <Label for="new-email" class="block text-sm font-medium leading-none">
        New Email Address
      </Label>
      <IdentInput
        bind:identifier={newEmail}
        identType={UserIdentType.email}
        bind:identError={errorMessage}
        showAvailabilityMessage={true}
        placeholder="Enter new email address"
      />
    </div>

    <div class="space-y-2">
      <Label for="current-password" class="block text-sm font-medium leading-none">
        Current Password
      </Label>
      <PasswordInput
        id="email-change-password"
        showValidation={true}
        placeholder="password"
        bind:isValid={isPasswordValid}
        bind:value={currentPassword}
      />
    </div>

    <Dialog.Footer class="mt-6 flex justify-end gap-3">
      <Button variant="outline" type="button" onclick={onCancel}>Cancel</Button>
      <Button type="submit" disabled={isLoading || !formIsValid} onclick={onSave}>
        {isLoading ? 'Saving...' : 'Save changes'}
      </Button>
    </Dialog.Footer>
  </div>
</form>
