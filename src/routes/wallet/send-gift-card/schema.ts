import { m } from '@/paraglide/messages';
import { z } from 'zod';
import { emailSchema, phoneSchema, usernameSchema } from '../../../lib/schemas/common';
export { emailSchema, phoneSchema, usernameSchema };

const baseSendGiftSchema = z.object({
  recipientFullName: z.string().max(30, m['send_gift_card.error.sender_name_max_length']()),
  message: z.string().max(500, m['send_gift_card.error.message_max_length']()),
});

export const sendGiftCardSchema = baseSendGiftSchema.extend({
  recipientEmail: emailSchema.default('').transform((val) => (val ? val.trim() : val)),
});

export const sendGiftCardSmsSchema = baseSendGiftSchema.extend({
  recipientPhone: phoneSchema.default('').transform((val) => (val ? val.trim() : val)),
});

export const sendGiftLinkSchema = z.object({
  recipientFullName: z.string().max(30, m['send_gift_card.error.sender_name_max_length']()),
});

export type SendGiftCardSchema = z.infer<typeof sendGiftCardSchema>;
export type SendGiftCardSmsSchema = z.infer<typeof sendGiftCardSmsSchema>;
export type SendGiftLinkSchema = z.infer<typeof sendGiftLinkSchema>;
