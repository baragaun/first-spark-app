import { m } from '@/paraglide/messages';
import { z } from 'zod';

export const usernameSchema = z
  .string({
    message: m['setting.username.error.min_length'](),
  })
  .min(3)
  .max(30);

export const currentPasswordSchema = z.string().min(8, {
  message: m['setting.password.error.required'](),
});

export const newPasswordSchema = z.string().min(8, {
  message: m['setting.password.error.min_length'](),
});

export const emailSchema = z.string().email({
  message: m['setting.email.error.invalid'](),
});

export const otpSchema = z.string().min(6, {
  message: m['verify_token.error.min_length'](),
});

export const usernameFormSchema = z.object({
  username: z
    .string()
    .min(3, m['setting.username.error.min_length']())
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
