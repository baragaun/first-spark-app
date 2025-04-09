import { z } from 'zod';

export const schemaFirstStep = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export const schemaStepTwo = schemaFirstStep.extend({
  emailOtp: z.string().min(6, {
    message: 'Your one-time password must be at least 6 characters.',
  }),
});

export const schemaLastStep = schemaStepTwo.extend({
  newPassword: z.string().min(8, {
    message: 'Your password must be at least 8 characters.',
  }),
});

// The exported type should be the totality of the form. Since this is stepped, we need to specify the last.
export type ResetPasswordFormSchema = typeof schemaLastStep;