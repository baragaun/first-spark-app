<script lang="ts">
  import { zod } from 'sveltekit-superforms/adapters';
  import { sendGiftCardSchema, type SendGiftCardSchema } from './schema';
  import IdentFormInput from '$lib/components/forms/form-ident-input.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { debounce } from 'throttle-debounce';
  import FormButton from '@/components/forms/form-button.svelte';
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
  import { getWalletItemsStore } from '@/stores/wallet-store.svelte';
  import { page } from '$app/state';
  import { handleGiftCardTransfer } from '$lib/utils/gift-card-transfer';

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
      cancel();
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

  let walletItem = $derived(getWalletItemsStore().find((p) => p.id === data.walletItemId) || null);

  const sendEmail = async (
    transferSlug: string,
    secretCode: string,
    recipientEmail: string,
    recipientFullName?: string,
    message?: string,
  ) => {
    const attachmentLink = `${page.url.origin}/gifted-card/${transferSlug}`;
    const subject = encodeURIComponent(`${myUserContext.myUser?.userHandle} sent you a gift card`);
    // Not showing expiresAt as it is always null
    // const expiresAt = $walletItem?.expiresAt ? `Expiry Date: ${$walletItem?.expiresAt}` : '';
    const balance = walletItem?.balance ? (walletItem?.balance / 1000).toFixed(0) : 0;
    const body = encodeURIComponent(
      `${message}

------------------------------------
Details:
Gift Card Value: ${balance}
Accept gift at: ${attachmentLink}
Unlock code: ${secretCode}
------------------------------------`,
    );

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

    const success = await handleGiftCardTransfer({
      walletItemId: data.walletItemId,
      formData: {
        recipientFullName: $formData.recipientFullName,
        recipientEmail: $formData.recipientEmail,
        messageText: $formData.message,
        showOnline: true,
      },
      onSuccess: (transferSlug: string, transferSecret: string) => {
        sendEmail(
          transferSlug,
          transferSecret,
          $formData.recipientEmail,
          $formData.recipientFullName,
          $formData.message,
        );
        showDialog = true;
      },
      onError: (error: any) => {
        console.error('Transfer creation failed:', error);
      },
    });
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
</script>

<form
  method="POST"
  use:enhance
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
