import { z } from 'zod';

// Username schema
export const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
});

// Email schema
export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

// Password schema without confirm password
export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Delete account schema
export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email('Please enter a valid email address'),
});

// Combined schema for the entire form
export const accountSettingsSchema = z.object({
  ...usernameSchema.shape,
  ...emailSchema.shape,
  ...passwordSchema.shape,
  ...deleteAccountSchema.shape,
});

export type AccountSettingsSchema = typeof accountSettingsSchema;

