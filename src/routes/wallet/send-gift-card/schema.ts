import { z } from 'zod';
import { emailSchema, usernameSchema } from '../../../lib/schemas/common';

export { emailSchema, usernameSchema };

export const sendGiftCardSchema = z.object({
  senderName: usernameSchema
    .optional()
    .default('')
    .transform((val) => (val ? val.trim() : val)),
  senderEmail: emailSchema
    .optional()
    .default('')
    .transform((val) => (val ? val.trim() : val)),
  message: z.string().max(500, 'Message is too long').optional(),
});

//export type SendGiftCardSchema = typeof sendGiftCardSchema;

export type SendGiftCardSchema = z.infer<typeof sendGiftCardSchema>;
