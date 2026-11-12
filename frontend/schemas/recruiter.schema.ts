import { email, strongPassword } from '@/schemas/auth.schema';
import { isoDateAfterDays, todayIsoDate } from '@/utils/datetime';
import { z } from 'zod';

export const recruiterProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(50, 'Full name must be at most 50 characters.'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { error: 'Please select your gender.' }),
  companyName: z
    .string()
    .trim()
    .min(2, 'Please enter your company name.')
    .max(100, 'Company name must be at most 100 characters.'),
  city: z.string().min(1, 'Please select a work location.'),
  districtWard: z.string().trim().optional(),
});

export const recruiterRegisterSchema = recruiterProfileSchema
  .extend({
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    acceptTerms: z.boolean().refine((value) => value, {
      message: 'Please accept the Terms of Service and Privacy Policy.',
    }),
    acceptMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.password.toLowerCase() !== data.email.toLowerCase(), {
    message: 'Password must not be the same as the email.',
    path: ['password'],
  });

const budgetAmount = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d{1,9}$/.test(value), {
    message: 'Budget must contain digits only (up to 9 digits).',
  });

const recruiterNeedsShape = z.object({
  position: z.string().min(1, 'Please select a role.'),
  level: z.string().min(1, 'Please select a level.'),
  hireBy: z.string().refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Please enter a valid date.',
  }),
  continuous: z.boolean(),
  headcount: z
    .number({ error: 'Please enter the number of hires.' })
    .int('Number of hires must be a whole number.')
    .min(1, 'Number of hires must be at least 1.')
    .max(100, 'Number of hires must be at most 100.'),
  budgetFrom: budgetAmount,
  budgetTo: budgetAmount,
  budgetSource: z.enum(['COMPANY', 'PERSONAL']),
  consultation: z.string(),
});

const hireByFields = recruiterNeedsShape.pick({ hireBy: true, continuous: true });
const budgetFields = recruiterNeedsShape.pick({ budgetFrom: true, budgetTo: true });

export const recruiterNeedsSchema = recruiterNeedsShape
  .refine((data) => data.continuous || data.hireBy !== '', {
    message: 'Please choose a hire-by date or select Hire continuously.',
    path: ['hireBy'],
    when: ({ value }) => hireByFields.safeParse(value).success,
  })
  .refine((data) => data.continuous || data.hireBy === '' || data.hireBy <= isoDateAfterDays(180), {
    message: 'Hire-by date must be within the next 180 days.',
    path: ['hireBy'],
    when: ({ value }) => hireByFields.safeParse(value).success,
  })
  .refine((data) => data.continuous || data.hireBy === '' || data.hireBy >= todayIsoDate(), {
    message: 'Hire-by date cannot be in the past.',
    path: ['hireBy'],
    when: ({ value }) => hireByFields.safeParse(value).success,
  })
  .refine(
    (data) => data.budgetFrom === '' || data.budgetTo === '' || Number(data.budgetTo) >= Number(data.budgetFrom),
    {
      message: 'Budget "To" must be greater than or equal to "From".',
      path: ['budgetTo'],
      when: ({ value }) => budgetFields.safeParse(value).success,
    },
  );

export type RecruiterProfileFormData = z.infer<typeof recruiterProfileSchema>;
export type RecruiterRegisterFormData = z.infer<typeof recruiterRegisterSchema>;
export type RecruiterNeedsFormData = z.infer<typeof recruiterNeedsSchema>;
