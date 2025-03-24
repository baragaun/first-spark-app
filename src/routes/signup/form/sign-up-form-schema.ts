import { z } from 'zod';

// TODO: Unsure if we're going to use stepped schemas like this, will revisit late

export const schemaStep1 = z.object({
  email: z.string().email(),
});

export const schemaStep2 = schemaStep1.extend({
  emailOtp: z.string().min(6, {
    message: 'Your one-time password must be at least 6 characters.',
  }),
});

export const schemaStep3 = schemaStep2.extend({
  username: z.string().min(2).max(50),
  password: z.string(),
});

export const formSchema = z.object({
  ...schemaStep1.shape,
  ...schemaStep2.shape,
  ...schemaStep3.shape,
});

export type FormSchema = typeof formSchema;
