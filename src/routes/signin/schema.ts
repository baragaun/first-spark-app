import { z } from 'zod';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const emailSchema = z.string().email({
  message: 'Please enter a valid email address.',
}).refine((email) => isValidEmail(email));

export const usernameSchema = z.string({
  message: 'A username must be at least 3 characters.'
}).min(3).max(30);

const otpSchema = z.string().min(6, {
  message: 'Your one-time password must be at least 6 characters.',
}).transform((val) => val.trim());

const passwordSchema = z.string().min(8, {
  message: 'Your password must be at least 8 characters.',
}).transform((val) => val.trim());

export const schemaFirstStep = z.object({
  ident: z
    .string()
    .min(3, 'Username or email is required')
    .transform((val) => val.trim()),
  token: otpSchema.optional(),
  password: passwordSchema.optional(),
  authType: z.literal('password').default('password'),
});

export const schemaLastStep = schemaFirstStep.extend({
  token: otpSchema.optional(),
  authType: z.literal('token').optional(),
});

export const signInFormSchema = z.discriminatedUnion('authType', [
  schemaFirstStep,
  schemaLastStep,
]);

export const getOtpMessage = (formData: { ident?: string }) => {
  const identifier = formData.ident || '';
  return `Enter the verification code sent to ${identifier}`;
};

// Since steps swap required values, we need to join the two possible schemas to account for all possible requirements
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
