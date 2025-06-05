import { m } from '@/paraglide/messages';
import { UserIdentType } from '@baragaun/bg-node-client';
import { z } from 'zod';
import { emailSchema, otpSchema, passwordSchema, usernameSchema } from '../../lib/schemas/common';

export const schemaFirstStep = z.object({
  ident: z
    .string()
    .min(3, m['signin.error.required']())
    .transform((val) => val.trim()),
  token: otpSchema.transform((val) => val.trim()).optional(),
  password: passwordSchema.transform((val) => val.trim()).optional(),
  authType: z.literal('password').default('password'),
});

export const schemaLastStep = schemaFirstStep.extend({
  token: otpSchema.transform((val) => val.trim()).optional(),
  authType: z.literal('token').optional(),
});

export const signInFormSchema = z.discriminatedUnion('authType', [schemaFirstStep, schemaLastStep]);

export const getOtpMessage = (formData: { ident?: string }) => {
  const identifier = formData.ident || '';
  return m['signin.sign_with_token_description']({ identifier });
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

// Since steps swap required values, we need to join the two possible schemas to account for all possible requirements
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
