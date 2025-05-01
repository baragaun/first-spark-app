import { z } from 'zod';

export const usernameSchema = z
  .string({
    message: 'A username must be at least 3 characters',
  })
  .min(3)
  .max(30);

export const currentPasswordSchema = z.string().min(8, {
  message: 'Current password is required ',
});

export const newPasswordSchema = z.string().min(8, {
  message: 'Your password must be at least 8 characters',
});

export const emailSchema = z.string().email({
  message: 'Please enter a valid email address.',
});

export const otpSchema = z.string().min(6, {
  message: 'Your one-time password must be at least 6 characters',
});

export const usernameFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .transform((val) => val.trim()),
});

export const emailFormSchemaFirstStep = z.object({
  email: emailSchema.transform((val) => val.trim()),
});

export const emailFormSchemaLastStep = emailFormSchemaFirstStep.extend({
  token: otpSchema.transform((val) => val.trim()),
});

export const passwordFormSchema = z.object({
  currentPassword: currentPasswordSchema.transform((val) => val.trim()),
  newPassword: newPasswordSchema.transform((val) => val.trim()),
});

export const deleteAccountFormSchema = z.object({
  confirmEmail: emailSchema.transform((val) => val.trim()),
  reason: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  description: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

export type UsernameFormSchema = z.infer<typeof usernameFormSchema>;
export type EmailFormSchema = z.infer<typeof emailFormSchemaLastStep>;
export type PasswordFormSchema = z.infer<typeof passwordFormSchema>;
export type DeleteAccountFormSchema = z.infer<typeof deleteAccountFormSchema>;
