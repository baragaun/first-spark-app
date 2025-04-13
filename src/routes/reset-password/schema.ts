import { UserIdentType } from '@baragaun/bg-node-client';
import { z } from 'zod';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const emailSchema = z
  .string()
  .email({
    message: 'Please enter a valid email address.',
  })
  .refine((email) => isValidEmail(email));

export const usernameSchema = z
  .string({
    message: 'A username must be at least 3 characters.',
  })
  .min(3)
  .max(30);

export const schemaFirstStep = z.object({
  ident: z
    .string()
    .min(3, 'Username or email is required')
    .transform((val) => val.trim()),
});

export const schemaStepTwo = schemaFirstStep.extend({
  token: z.string().min(6, {
    message: 'Your one-time password must be at least 6 characters.',
  }),
});

export const schemaLastStep = schemaStepTwo.extend({
  newPassword: z.string().min(8, {
    message: 'Your password must be at least 8 characters.',
  }),
  actionId: z.string(),
});

export const getOtpMessage = (formData: { ident?: string }) => {
  const identifier = formData.ident || '';
  return `Enter the verification code sent to ${identifier}`;
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
export type ResetPasswordFormSchema = typeof schemaLastStep;
