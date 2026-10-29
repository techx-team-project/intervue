import { ADMIN_PERMISSION_ORDER } from '@/constants/admin-user';
import { ROLES } from '@/constants/auth';
import { z } from 'zod';

export const lockUserSchema = z.object({
  reason: z.string().trim().min(1, 'Pick a reason or write your own'),
  detail: z.string().trim().max(500, 'Keep the note under 500 characters').optional(),
  notifyUser: z.boolean(),
});

export type LockUserFormData = z.infer<typeof lockUserSchema>;

export const grantRoleSchema = z
  .object({
    role: z.enum([ROLES.CANDIDATE, ROLES.RECRUITER, ROLES.ADMIN]),
    isTemporary: z.boolean(),
    expiresAt: z.string().trim().optional(),
    reason: z.string().trim().min(1, 'Say why this role is being granted'),
  })
  .refine((data) => !data.isTemporary || (data.expiresAt ?? '').length > 0, {
    message: 'Pick the date the grant expires',
    path: ['expiresAt'],
  })
  .refine((data) => !data.isTemporary || Date.parse(data.expiresAt ?? '') > Date.now(), {
    message: 'The expiry date must be in the future',
    path: ['expiresAt'],
  });

export type GrantRoleFormData = z.infer<typeof grantRoleSchema>;

export const adminAccountSchema = z.object({
  name: z.string().trim().min(2, 'Enter the full name').max(50, 'Keep the name under 50 characters'),
  email: z.string().trim().toLowerCase().min(1, 'Enter the email address').pipe(z.email('Email address is invalid.')),
  permissions: z.array(z.enum(ADMIN_PERMISSION_ORDER)).min(1, 'Grant at least one permission'),
  expiresAt: z.string().trim().optional(),
});

export type AdminAccountFormData = z.infer<typeof adminAccountSchema>;
