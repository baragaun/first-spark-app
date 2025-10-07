import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageLoad } from './$types';
import { sendGiftCardSchema, sendGiftCardSmsSchema, sendGiftLinkSchema } from './schema';

export const load: PageLoad = async ({ url }) => {
  const walletItemId = url.searchParams.get('id');
  const emailForm = await superValidate(zod(sendGiftCardSchema));
  const smsForm = await superValidate(zod(sendGiftCardSmsSchema));
  const linkForm = await superValidate(zod(sendGiftLinkSchema));
  return { walletItemId, emailForm, smsForm, linkForm };
};
