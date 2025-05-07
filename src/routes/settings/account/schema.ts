import { m } from '@/paraglide/messages';
import { z } from 'zod';

const currentPasswordSchema = z
  .string()
  .min(1, {
    message: m['setting.password.error.required'](),
  })
  .transform((val) => val.trim());

export const emailSchema = z.string().email({
  message: m['setting.email.error.invalid'](),
});

// Username schema
export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, m['setting.username.error.min_length']())
    .max(30, m['setting.username.error.max_length']()),
});

const otpSchema = z
  .string()
  .min(6, {
    message: m['verify_token.error.min_length'](),
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
  newPassword: z.string().min(8, m['setting.password.error.min_length']()),
});

// Delete account schema
export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email(m['setting.email.error.invalid']()),
  reason: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateEmailFormSchema = z.infer<typeof changeEmailschemaLastStep>;
export type UsernameSchema = z.infer<typeof usernameSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
