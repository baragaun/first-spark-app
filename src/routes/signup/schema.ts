import { UserIdentType } from '@baragaun/bg-node-client';
import { z } from 'zod';
import { emailSchema, otpSchema, passwordSchema, usernameSchema } from '../../lib/schemas/common';

export { emailSchema, usernameSchema };

export const schemaFirstStep = z.object({
  email: emailSchema.transform((val) => val.trim()),
});

export const schemaSecondStep = z.object({
  token: otpSchema.transform((val) => val.trim()),
});

export const schemaLastStep = z.object({
  username: usernameSchema.transform((val) => val.trim()),
  password: passwordSchema.transform((val) => val.trim()),
});

export const completeSchema = z.object({
  email: emailSchema.optional().default('').transform((val) => val ? val.trim() : val),
  token: otpSchema.optional().default('').transform((val) => val ? val.trim() : val),
  username: usernameSchema.optional().default('').transform((val) => val ? val.trim() : val),
  password: passwordSchema.optional().default('').transform((val) => val ? val.trim() : val),
});

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

export type SignUpFormSchema = z.infer<typeof completeSchema>;
