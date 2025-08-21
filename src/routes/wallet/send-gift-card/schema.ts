import { m } from '@/paraglide/messages';
import { z } from 'zod';
import { emailSchema, usernameSchema } from '../../../lib/schemas/common';
export { emailSchema, usernameSchema };

export const sendGiftCardSchema = z.object({
  recipientFullName: z.string().max(30, m['send_gift_card.error.sender_name_max_length']()),
  recipientEmail: emailSchema.default('').transform((val) => (val ? val.trim() : val)),
  message: z.string().max(500, m['send_gift_card.error.message_max_length']()),
});

//export type SendGiftCardSchema = typeof sendGiftCardSchema;

export type SendGiftCardSchema = z.infer<typeof sendGiftCardSchema>;
