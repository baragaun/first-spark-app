import { UserIdentType } from '@baragaun/bg-node-client';
import { z } from 'zod';
import { emailSchema, otpSchema, passwordSchema, usernameSchema } from '../../lib/schemas/common';

export { emailSchema, usernameSchema };

export const schemaFirstStep = z.object({
  email: emailSchema.transform((val) => val.trim()),
});

export const schemaSecondStep = schemaFirstStep.extend({
  token: otpSchema.transform((val) => val.trim()),
});

export const schemaLastStep = schemaSecondStep.extend({
  username: usernameSchema.transform((val) => val.trim()),
  password: passwordSchema.transform((val) => val.trim()),
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

// Since steps swap required values, we need to join the two possible schemas to account for all possible requirements
export type SignUpFormSchema = z.infer<typeof schemaLastStep>;
