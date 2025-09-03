import { GiftCardDenomination, GiftCardProduct } from '@baragaun/bg-node-client';

export const getGiftCardDenominations = (
  products: GiftCardProduct[] | null | undefined,
  thisProduct: GiftCardProduct | null | undefined,
): GiftCardDenomination[] => {
  if (Array.isArray(thisProduct?.denominations) && thisProduct.denominations.length > 0) {
    return thisProduct.denominations.sort((a, b) => a.amount - b.amount);
  }

  if (!Array.isArray(products) || products.length < 1 || !thisProduct?.genericGiftCardId) {
    return [];
  }

  const genericProduct = products.find((product) => product.id === thisProduct.genericGiftCardId);

  if (!Array.isArray(genericProduct?.denominations) || genericProduct.denominations.length < 1) {
    return [];
  }

  genericProduct.denominations.sort((a, b) => a.amount - b.amount);

  return genericProduct.denominations;
};
