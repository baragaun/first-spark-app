import { z } from 'zod';

export const emailSchema = z.string().email({
  message: 'Please enter a valid email address.',
}).optional();

export const usernameSchema = z.string({
  message: 'A username must be at least 3 characters.',
}).min(3).max(30).optional();

export const passwordSchema = z.string().min(8, {
  message: 'Your password must be at least 8 characters.',
}).optional();

export const otpSchema = z.string().min(6, {
  message: 'Your one-time password must be at least 6 characters.',
}).optional();

export const getOtpMessage = (formData: {
  email?: string;
  username?: string 
}) => {
  if (formData.email) {
    return `Enter the six digit code that was sent to ${formData.email}`;
  } else if (formData.username) {
    return `Enter the six digit code that was sent to the email associated with ${formData.username}`;
  } else {
    return `Enter the six digit verification code`;
  }
};

export const schemaFirstStep = z.object({
  email: emailSchema,
  username: usernameSchema,
}).refine(
  data => (data.email && data.email.length > 0) || (data.username && data.username.length > 0),
  {
    message: "Either email or username must be provided",
    path: ["identifierMissing"]
  }
);

export const schemaLastStep = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  emailOtp: otpSchema,
}).refine(
  data => data.email || data.username,
  {
    message: "Either email or username must be provided",
    path: ["identifierMissing"]
  }
).refine(
  data => data.password || data.emailOtp,
  {
    message: "Either password or one-time password must be provided",
    path: ["authMethodMissing"]
  }
);

// The exported type should be the totality of the form. Since this is stepped, we need to specify the last.
export type SignInFormSchema = z.infer<typeof schemaLastStep>;