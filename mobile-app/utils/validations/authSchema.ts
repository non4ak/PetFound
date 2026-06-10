import { z } from 'zod';

const allowedUserNamePattern = /^[A-Za-z0-9\-._@+]+$/;

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signUpSchema = z
  .object({
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .refine((value: string) => /[a-z]/.test(value), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((value: string) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((value: string) => /\d/.test(value), {
        message: 'Password must contain at least one digit',
      })
      .refine((value: string) => new Set(value).size >= 3, {
        message: 'Password must contain at least 3 unique characters',
      }),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters long')
      .regex(
        allowedUserNamePattern,
        'Username can contain only letters, numbers, and - . _ @ + symbols',
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
