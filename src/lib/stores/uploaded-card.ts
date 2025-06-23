import { writable } from 'svelte/store';

export const uploadedCard = writable({
  brand: '',
  balance: '',
  barcode: '',
  pin: '',
  imageUrl: '',
  isLoading: false,
});
