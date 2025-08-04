import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageLoad } from './$types';
import { sendGiftCardSchema } from './schema';

export const load: PageLoad = async ({ url }) => {
  const walletItemId = url.searchParams.get('id');
  return { form: await superValidate(zod(sendGiftCardSchema)), walletItemId };
};
