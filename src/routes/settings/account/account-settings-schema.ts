import { z } from 'zod';

// Username schema
export const usernameSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').max(50),
});

// Email schema
export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

// Extract the base schema before applying refine
const basePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
});

// Password schema with validation
export const passwordSchema = basePasswordSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  },
);

// Delete account schema
export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email('Please enter a valid email address'),
});

// Combined schema for the entire form
export const accountSettingsSchema = z.object({
  ...usernameSchema.shape,
  ...emailSchema.shape,
  ...basePasswordSchema.shape,
  ...deleteAccountSchema.shape,
});

export type AccountSettingsSchema = typeof accountSettingsSchema;
