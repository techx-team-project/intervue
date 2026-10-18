import { z } from 'zod';

const email = z
  .string()
  .min(1, 'Please enter your email.')
  .max(100, 'Email must be at most 100 characters.')
  .pipe(z.email('Email address is invalid.'));

const strongPassword = z
  .string()
  .min(1, 'Please enter your password.')
  .min(8, 'Password must be at least 8 characters.')
  .max(72, 'Password must be at most 72 characters.')
  .regex(/[a-z]/, 'Password must include a lowercase letter.')
  .regex(/[A-Z]/, 'Password must include an uppercase letter.')
  .regex(/[0-9]/, 'Password must include a digit.')
  .regex(/[^A-Za-z0-9]/, 'Password must include a special character (!@#$).');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Please enter your password.').max(72, 'Password must be at most 72 characters.'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters.')
      .max(50, 'Full name must be at most 50 characters.'),
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    acceptTerms: z.boolean().refine((value) => value, {
      message: 'Please accept the Terms of Service and Privacy Policy.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.password.toLowerCase() !== data.email.toLowerCase(), {
    message: 'Password must not be the same as the email.',
    path: ['password'],
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must include an uppercase letter.')
      .regex(/[0-9]/, 'Password must include a digit.')
      .regex(/[^A-Za-z0-9]/, 'Password must include a special character (!@#$).'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
    logoutOtherDevices: z.boolean().default(true),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirmation does not match the new password.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must differ from the current password.',
    path: ['newPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type LoginPayload = LoginFormData;
export type RegisterPayload = RegisterFormData;
export type ForgotPasswordPayload = ForgotPasswordFormData;
export type ResetPasswordPayload = ResetPasswordFormData & { token: string };
