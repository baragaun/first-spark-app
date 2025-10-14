import { marketplaceContext } from '@/contexts/marketplace-context.svelte';

export interface TransferFormData {
  recipientFullName: string;
  recipientEmail?: string;
  recipientPhoneNumber?: string;
  messageText: string;
  showOnline: boolean;
}

export interface TransferOptions {
  walletItemId: string;
  formData: TransferFormData;
  onSuccess: (transferSlug: string, transferSecret: string) => void;
  onError?: (error: any) => void;
}

/**
 * Generates a secure 6-digit code for gift card transfers
 */
export function getSecureCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 1000000).toString().padStart(6, '0');
}

/**
 * Handles the common form submission logic for gift card transfers
 */
export async function handleGiftCardTransfer(options: TransferOptions): Promise<boolean> {
  const { walletItemId, formData, onSuccess, onError } = options;

  try {
    const transferSecret = getSecureCode();

    const transferData: any = {
      transferSecret,
      walletItemId,
      recipientFullName: formData.recipientFullName,
      messageText: formData.messageText,
      showOnline: formData.showOnline,
    };

    // Add recipient contact info based on what's provided
    if (formData.recipientEmail) {
      transferData.recipientEmail = formData.recipientEmail;
    }
    if (formData.recipientPhoneNumber) {
      transferData.recipientPhoneNumber = formData.recipientPhoneNumber;
    }

    const response = await marketplaceContext.createWalletItemTransfer(transferData);

    if (response.error || !response.object?.transferSlug) {
      onError?.(response.error || 'Failed to create transfer');
      return false;
    }

    onSuccess(response.object.transferSlug, transferSecret);
    return true;
  } catch (error) {
    onError?.(error);
    return false;
  }
}
