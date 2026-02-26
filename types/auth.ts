import { z } from 'zod';

/**
 * Aligned with backend AuthDto: email (IsEmail), password (IsString, MinLength(6)).
 * Used for both login and register API payloads.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Register: same as login (backend only receives email + password) plus
 * confirmPassword for client-side match validation.
 */
export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
