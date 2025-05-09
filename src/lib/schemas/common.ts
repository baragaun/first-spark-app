import { m } from '@/paraglide/messages';
import { z } from 'zod';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
};

// Base username schema without trimming
export const usernameSchema = z
  .string()
  .min(3, m['setting.username.error.min_length']())
  .max(30, m['setting.username.error.max_length']())
  .refine((username) => isValidUsername(username), {
    message: m['setting.username.error.alphanumeric'](),
  });

// Email schema
export const emailSchema = z
  .string()
  .email({
    message: m['setting.email.error.invalid'](),
  })
  .refine((email) => isValidEmail(email));

// Password schemas
export const passwordSchema = z.string().min(8, {
  message: m['setting.password.error.min_length'](),
});

// OTP schema
export const otpSchema = z.string().min(6, {
  message: m['verify_token.error.min_length'](),
});
