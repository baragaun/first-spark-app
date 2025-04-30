import { z } from 'zod';

export const currentPasswordSchema = z.string().min(8, {
  message: 'Current password is required ',
});

export const emailSchema = z.string().email({
  message: 'Please enter a valid email address.',
});

export const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
});

const otpSchema = z
  .string()
  .min(6, {
    message: 'Your one-time password must be at least 6 characters.',
  })
  .transform((val) => val.trim());

export const changeEmailschemaFirstStep = z.object({
  email: emailSchema,
  currentPassword: currentPasswordSchema,
});

export const changeEmailschemaLastStep = changeEmailschemaFirstStep.extend({
  token: otpSchema,
});

// Password schema without confirm password
export const passwordSchema = z.object({
  currentPassword: currentPasswordSchema,
  newPassword: z.string().min(8, 'Password must be at least 8 characters long.'),
});

// Delete account schema
export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email('You must enter your current email address.'),
  reason: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateEmailFormSchema = z.infer<typeof changeEmailschemaLastStep>;
export type UsernameSchema = z.infer<typeof usernameSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
