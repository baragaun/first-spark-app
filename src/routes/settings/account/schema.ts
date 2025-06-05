import { m } from '@/paraglide/messages';
import { z } from 'zod';
import {
  emailSchema,
  otpSchema,
  passwordSchema,
  usernameSchema,
} from '../../../lib/schemas/common';

const currentPasswordSchema = z
  .string()
  .min(1, {
    message: m['setting.password.error.required'](),
  })
  .transform((val) => val.trim());

const changeEmailschemaFirstStep = z.object({
  email: emailSchema.transform((val) => val.trim()),
  currentPassword: currentPasswordSchema,
});

const changeEmailschemaLastStep = changeEmailschemaFirstStep.extend({
  token: otpSchema.transform((val) => val.trim()),
});

// update password schema
const updatePasswordSchema = z.object({
  currentPassword: currentPasswordSchema,
  newPassword: passwordSchema.transform((val) => val.trim()),
});

// Delete account schema
const deleteAccountSchema = z.object({
  confirmEmail: emailSchema.transform((val) => val.trim()),
  reason: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateEmailFormSchema = z.infer<typeof changeEmailschemaLastStep>;
export type UsernameSchema = z.infer<typeof usernameSchema>;
export type PasswordSchema = z.infer<typeof updatePasswordSchema>;
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
