import { m } from '@/paraglide/messages';
import { UserIdentType } from '@baragaun/bg-node-client';
import { z } from 'zod';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const emailSchema = z
  .string()
  .email({
    message: 'Please enter a valid email address',
  })
  .refine((email) => isValidEmail(email));

export const usernameSchema = z
  .string({
    message: 'A username must be at least 3 characters',
  })
  .min(3)
  .max(30);

const otpSchema = z.string().min(6, {
  message: m['verify_token.error.min_length'](),
});

const passwordSchema = z.string().min(8, {
  message: 'Your password must be at least 8 characters',
});

export const schemaFirstStep = z.object({
  ident: z
    .string()
    .min(3, 'A valid username or email is required')
    .transform((val) => val.trim()),
});

export const schemaLastStep = schemaFirstStep.extend({
  newPassword: passwordSchema.transform((val) => val.trim()),
  token: otpSchema.transform((val) => val.trim()),
  actionId: z.string(),
});

export const getOtpMessage = (formData: { ident?: string }) => {
  const identifier = formData.ident || '';
  return `Enter a new password and the verification code we sent to ${identifier} to update your password`;
};

export const determineIdentifierType = (value: string): UserIdentType => {
  const emailValidationResult = emailSchema.safeParse(value);
  if (emailValidationResult.success) {
    return UserIdentType.email;
  }

  const usernameValidationResult = usernameSchema.safeParse(value);
  if (usernameValidationResult.success) {
    return UserIdentType.userHandle;
  }

  return UserIdentType.email;
};

// The exported type should be the totality of the form. Since this is stepped, we need to specify the last.
export type ResetPasswordFormSchema = z.infer<typeof schemaLastStep>;
