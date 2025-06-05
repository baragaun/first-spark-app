import { m } from '@/paraglide/messages';
import { z } from 'zod';
import {
  emailSchema,
  otpSchema,
  passwordSchema,
  usernameSchema,
} from '../../../lib/schemas/common';

export const currentPasswordSchema = z.string().min(8, {
  message: m['setting.password.error.required'](),
});

export const usernameFormSchema = z.object({
  username: usernameSchema.transform((val) => val.trim()),
});

export const emailFormSchemaFirstStep = z.object({
  email: emailSchema.transform((val) => val.trim()),
});

export const emailFormSchemaLastStep = emailFormSchemaFirstStep.extend({
  token: otpSchema.transform((val) => val.trim()),
});

export const passwordFormSchema = z.object({
  currentPassword: currentPasswordSchema.transform((val) => val.trim()),
  newPassword: passwordSchema.transform((val) => val.trim()),
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
