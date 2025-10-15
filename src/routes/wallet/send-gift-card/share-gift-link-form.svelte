<script lang="ts">
  import { zod } from 'sveltekit-superforms/adapters';
  import { sendGiftLinkSchema, type SendGiftLinkSchema } from './schema';
  import IdentFormInput from '$lib/components/forms/form-ident-input.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { debounce } from 'throttle-debounce';
  import FormButton from '@/components/forms/form-button.svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Copy, Share } from 'lucide-svelte';
  import { m } from '@/paraglide/messages';
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { getWalletItemsStore } from '@/stores/wallet-store.svelte';
  import { page } from '$app/state';
  import { handleGiftCardTransfer } from '$lib/utils/gift-card-transfer';

  const DEBOUNCE_DELAY = 350;

  let { data }: { data: { form: SuperValidated<SendGiftLinkSchema>; walletItemId: string } } =
    $props();

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zod(sendGiftLinkSchema),
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

  let giftLinkCreated = $state(false);
  let giftLink = $state('');
  let transferSecret = $state('');

  const buttonState = $derived.by(() => ({
    isDisabled: !isFormValid || formState.isLoading || formState.hasError,
    isLoading: ($delayed || formState.isLoading) && !formState.hasError,
  }));

  const isFormValid = $derived.by(() => {
    return $formData.recipientFullName && $formData.recipientFullName.trim().length > 0;
  });

  let walletItem = $derived(getWalletItemsStore().find((p) => p.id === data.walletItemId) || null);

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
        messageText: 'Gift for you!',
        showOnline: true,
        sendMethod: 'link',
      },
      onSuccess: (transferSlug: string, secret: string) => {
        transferSecret = secret;
        giftLink = `${page.url.origin}/gifted-card/${transferSlug}`;
        giftLinkCreated = true;
      },
      onError: (error: any) => {
        formState.hasError = true;
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(giftLink);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareLink = async () => {
    const balance = walletItem?.balance ? (walletItem?.balance / 1000).toFixed(0) : 0;
    const shareText = `${myUserContext.myUser?.userHandle} sent you a gift card worth ${balance}!

Accept your gift at: ${giftLink}
Unlock code: ${transferSecret}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gift Card from ' + myUserContext.myUser?.userHandle,
          text: shareText,
          url: giftLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying the text
      try {
        await navigator.clipboard.writeText(shareText);
      } catch (err) {
        console.error('Failed to copy share text:', err);
      }
    }
    goto('/wallet');
  };
</script>

{#if !giftLinkCreated}
  <form
    method="POST"
    use:enhance
    class="mx-auto max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-background"
  >
    <div class="text-center">
      <h2 class="mb-2 text-xl font-semibold">Send Card Using Gift Link</h2>
      <p class="text-sm text-gray-600">Create a shareable link for your gift card</p>
    </div>

    <div>
      <IdentFormInput
        {form}
        fieldName="recipientFullName"
        label={m['send_gift_card.sender_name']()}
        placeholder={m['send_gift_card.sender_name_placeholder']()}
        identType={UserIdentType.userHandle}
      />
      {#if $errors.recipientFullName}
        <div class="mt-1 text-xs text-red-500">{$errors.recipientFullName[0]}</div>
      {/if}
    </div>

    <FormButton
      disabled={buttonState.isDisabled}
      isLoading={buttonState.isLoading}
      buttonText="Create Gift Link"
      loadingText="Creating..."
    />
  </form>
{:else}
  <div class="mx-auto max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-background">
    <div class="text-center">
      <h2 class="mb-2 text-xl font-semibold text-muted-foreground">Gift Link Created!</h2>
      <p class="text-sm text-gray-600">Share this link with {$formData.recipientFullName}</p>
    </div>

    <div class="space-y-3">
      <div>
        <label for="giftLink" class="mb-1 block text-sm font-medium">Gift Link</label>
        <div class="flex gap-2">
          <Input
            type="text"
            id="giftLink"
            value={giftLink}
            readonly
            class="flex-1 bg-gray-50 focus-visible:ring-transparent"
          />
          <Button type="button" variant="outline" size="icon" onclick={copyLink} title="Copy Link">
            <Copy class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <label for="unlockCode" class="mb-1 block text-sm font-medium">Unlock Code</label>
        <Input
          id="unlockCode"
          value={transferSecret}
          readonly
          class="bg-gray-50 font-mono focus-visible:ring-transparent"
        />
        <p class="mt-1 text-xs text-gray-500">Share this code with the recipient</p>
      </div>
    </div>

    <div class="flex gap-2">
      <Button type="button" variant="outline" onclick={copyLink} class="flex-1">
        <Copy class="mr-2 h-4 w-4" />
        Copy Link
      </Button>
      <Button
        type="button"
        onclick={shareLink}
        class="flex-1 bg-nav-foreground hover:bg-nav-foreground/90"
      >
        <Share class="mr-2 h-4 w-4" />
        Share Gift Link
      </Button>
    </div>
  </div>
{/if}
