<script lang="ts">
  import { zod } from 'sveltekit-superforms/adapters';
  import { sendGiftCardSchema, type SendGiftCardSchema } from './schema';
  import IdentFormInput from '$lib/components/forms/form-ident-input.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { debounce } from 'throttle-debounce';
  import FormButton from '@/components/forms/form-button.svelte';
  import { onMount } from 'svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  import { m } from '@/paraglide/messages';
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';

  const DEBOUNCE_DELAY = 350;

  let { data }: { data: { form: SuperValidated<SendGiftCardSchema>; walletItemId: string } } =
    $props();

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zod(sendGiftCardSchema),
    resetForm: false,
    validationMethod: 'submit-only',
    async onChange() {
      debouncedValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the server-side form action
      await handleFormSubmit();
    },
  });

  const { form: formData, errors, delayed, enhance, validateForm } = form;

  let formState = $state({
    isLoading: false,
    hasError: false,
  });

  const buttonState = $derived.by(() => ({
    isDisabled: !isFormValid || formState.isLoading || formState.hasError,
    isLoading: ($delayed || formState.isLoading) && !formState.hasError,
  }));

  const isFormValid = $derived.by(() => {
    return $formData.recipientFullName && $formData.recipientEmail && $formData.message;
  });

  let showDialog = $state(false);

  const sendEmail = async (
    transferSlug: string,
    secretCode: string,
    recipientEmail: string,
    recipientFullName?: string,
    message?: string,
  ) => {
    const attachmentLink = `http://localhost:5173/wallet/gifted-card/${transferSlug}`;
    const subject = encodeURIComponent('Receive your gift card');
    const body = encodeURIComponent(`
    Hello ${recipientFullName},

    Surprise! 🎉 We’re excited to share this special gift with you.
    Attached to this email, you’ll need to enter the secret code  ${secretCode} to activate your Gift Card.

    Details:
    Gift Card Value: [Amount]
    Expiry Date: [Expiry Date, if applicable]
    Redeemable Online/In-store: [Instructions]

    ${message}
    ${attachmentLink}

    To redeem, simply present this gift card at checkout or enter the gift card code when shopping online.
    We hope you enjoy your gift — you deserve it! 💝

    Warm regards,
    ${myUserContext.myUser?.userHandle}
    `);
    // You can append a link to the attachment in the email body
    const mailto = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  };

  const handleFormSubmit = async () => {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      formState.hasError = true;
      return;
    }

    const response = await marketplaceContext.createWalletItemTransfer({
      walletItemId: data.walletItemId,
      recipientFullName: $formData.recipientFullName,
      recipientEmail: $formData.recipientEmail,
      messageText: $formData.message,
    });

    if (response.error || !response.object?.transferSecret || !response.object?.transferSlug) {
      return;
    }

    sendEmail(
      response.object.transferSlug,
      response.object.transferSecret,
      $formData.recipientEmail,
      $formData.recipientFullName,
      $formData.message,
    );

    showDialog = true;
  };

  const debouncedValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const result = await validateForm({ update: true, focusOnError: false });
      formState.hasError = !result.valid;
    } catch (error) {
      console.error('Error validating form:', error);
    } finally {
      formState.isLoading = false;
    }
  });

  onMount(async () => {});
</script>

<form
  method="POST"
  use:enhance
  onsubmit={handleFormSubmit}
  class="mx-auto max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-background"
>
  <IdentFormInput
    {form}
    fieldName="recipientFullName"
    label={m['send_gift_card.sender_name']()}
    placeholder={m['send_gift_card.sender_name_placeholder']()}
    identType={UserIdentType.userHandle}
  />
  <IdentFormInput
    {form}
    fieldName="recipientEmail"
    label={m['send_gift_card.sender_email']()}
    placeholder={m['send_gift_card.sender_email_placeholder']()}
    identType={UserIdentType.email}
  />
  <div>
    <label class="mb-1 block text-sm font-medium" for="message"
      >{m['send_gift_card.message']()}</label
    >
    <textarea
      id="message"
      bind:value={$formData.message}
      name="message"
      rows="5"
      class="min-h-[120px] w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      placeholder={m['send_gift_card.message_placeholder']()}
    ></textarea>
    {#if $errors.message}
      <div class="mt-1 text-xs text-red-500">{$errors.message[0]}</div>
    {/if}
  </div>
  <FormButton
    disabled={buttonState.isDisabled}
    isLoading={buttonState.isLoading}
    buttonText={m['send_gift_card.send_gift']()}
    loadingText="sending"
  />
</form>

<AlertDialog open={showDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{m['send_gift_card.sent_title']()}</AlertDialogTitle>
      <AlertDialogDescription>{m['send_gift_card.sent_success']()}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction
        onclick={() => {
          showDialog = false;
          goto('/wallet');
        }}
      >
        {m['cart.okay']()}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
