import { z } from 'zod';
import { emailSchema, usernameSchema } from '../../../lib/schemas/common';

export const sendGiftSchema = z.object({
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

export type SendGiftSchema = typeof sendGiftSchema;
