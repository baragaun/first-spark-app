import { z } from 'zod';

export const sendGiftSchema = z.object({
  senderName: z.string().min(2, 'Name is required'),
  senderEmail: z.string().email('Invalid email address'),
  message: z.string().max(500, 'Message is too long').optional(),
});

export type SendGiftSchema = typeof sendGiftSchema;