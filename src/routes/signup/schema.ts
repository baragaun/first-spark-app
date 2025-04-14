import { UserIdentType } from '@baragaun/bg-node-client';
import { z } from 'zod';

// Failing this check will add an `invalid format` error
// const isValidEmail = (email: string): boolean => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };

// export const emailSchema = z.string().email({
//   message: 'Please enter a valid email address.',
// }).refine((email) => isValidEmail(email));

export const emailSchema = z.string().email({
  message: 'Please enter a valid email address.',
});

export const usernameSchema = z
  .string({
    message: 'A username must be at least 3 characters.',
  })
  .min(3)
  .max(30);

const otpSchema = z
  .string()
  .min(6, {
    message: 'Your one-time password must be at least 6 characters.',
  })
  .transform((val) => val.trim());

const passwordSchema = z
  .string()
  .min(8, {
    message: 'Your password must be at least 8 characters.',
  })
  .transform((val) => val.trim());

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

export const shouldUseTokenAuth = (formData: { token?: string; password?: string }): boolean => {
  return !!formData.token && (!formData.password || formData.password.length === 0);
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
export type SignUpFormSchema = z.infer<typeof schemaLastStep>;
