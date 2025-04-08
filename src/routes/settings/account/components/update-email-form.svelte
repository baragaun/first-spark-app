<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import IdentInput from '@/components/ident-input.svelte';
  import { Label } from '@/components/ui/label';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { emailSchema } from '../account-settings-schema';

  interface UpdateEmailFormProps {
    emailForm: SuperValidated<Infer<typeof emailSchema>>;
    isLoading: boolean;
    isPasswordValid: boolean;
    onCancel: () => void;
    onSave: (email: string, currentPassword: string) => void;
  }

  let {
    emailForm,
    isLoading = $bindable(false),
    isPasswordValid = $bindable(false),
    onCancel,
    onSave,
  }: UpdateEmailFormProps = $props();

  const form = superForm(emailForm, {
    validators: zodClient(emailSchema),
    validationMethod: 'oninput',
  });

  // Destructure form helpers
  const { form: formData, errors, enhance } = form;

  // Initialize with values from the SuperForm data
  let newEmail = $state(emailForm.data.email || '');
  let currentPassword = $state(emailForm.data.currentPassword || '');
  let isIdentAvailable = $state(null);
  let passwordErrorMsg = $state('');

  // Derive form validity
  let formIsValid = $derived(
    newEmail && isIdentAvailable && !passwordErrorMsg && !$errors.email && currentPassword,
  );

  // Update formData when newEmail and currentPassword change
  $effect(() => {
    $formData.email = newEmail;
    $formData.currentPassword = currentPassword;
    passwordErrorMsg = $errors.currentPassword?.[0] || '';
  });

  const verifyCurrentPasswordAndUpdateEmail = async (password: string) => {
    isLoading = true;
    passwordErrorMsg = '';

    const verifyMyPasswordResponse = await myUserContext.verifyMyPassword(password);
    if (
      verifyMyPasswordResponse.object === false ||
      verifyMyPasswordResponse.object?.toString() === 'false'
    ) {
      console.error('Incorrect password', {
        verifyMyPasswordResponse,
      });
      passwordErrorMsg = 'Incorrect password. Please verify and try again.';
      isPasswordValid = false;
      isLoading = false;
      return;
    }

    if (verifyMyPasswordResponse.error) {
      console.error('Failed to verify password:', {
        verifyMyPasswordResponse,
      });
      passwordErrorMsg = verifyMyPasswordResponse.error || AppUiMessage.systemError;
      isLoading = false;
      return;
    }

    isPasswordValid = true;
    isLoading = false;
    onSave(newEmail, currentPassword);
  };

  const handleSaveClick = () => {
    verifyCurrentPasswordAndUpdateEmail(currentPassword);
  };
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
        bind:isIdentAvailable
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
        placeholder="password"
        bind:isValid={isPasswordValid}
        bind:value={currentPassword}
        bind:errorMessage={passwordErrorMsg}
      />
    </div>

    <Dialog.Footer class="mt-6 flex justify-end gap-3">
      <Button variant="outline" type="button" onclick={onCancel}>Cancel</Button>
      <Button type="button" disabled={isLoading || !formIsValid} onclick={handleSaveClick}>
        {isLoading ? 'Saving...' : 'Save changes'}
      </Button>
    </Dialog.Footer>
  </div>
</form>
