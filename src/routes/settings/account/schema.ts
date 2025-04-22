import { z } from 'zod';

const currentPasswordSchema = z
  .string()
  .min(1, {
    message: 'Current password is required ',
  })
  .transform((val) => val.trim());

export const emailSchema = z.string().email({
  message: 'Please enter a valid email address.',
});

// Username schema
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
  confirmEmail: z.string().email('Please enter a valid email address'),
});

export type UpdateEmailFormSchema = z.infer<typeof changeEmailschemaLastStep>;
export type UsernameSchema = z.infer<typeof usernameSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
