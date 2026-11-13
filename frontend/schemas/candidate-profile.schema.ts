import {
  PROFILE_LIST_LIMIT,
  PROFILE_MAX_SALARY_VND,
  PROFILE_MIN_AGE,
  PROFILE_MIN_BIRTH_YEAR,
} from '@/constants/candidate-profile';
import { CAREER_LEVELS, CONTRACT_TYPES, GENDERS, JOB_SEARCH_STATUSES, WORK_MODES } from '@/types/candidate-profile';
import { z } from 'zod';

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) => z.union([z.literal(''), z.enum(values)]);

const optionalUrl = z
  .string()
  .trim()
  .max(255, 'Link must be at most 255 characters.')
  .refine((value) => value === '' || /^https?:\/\/.+/.test(value), 'Link must start with http:// or https://.');

const listItem = z.string().trim().min(1).max(100, 'Each item must be at most 100 characters.');

const salaryAmount = z.string().trim();
const SALARY_PATTERN = /^\d{1,15}$/;

export const candidateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters.')
      .max(50, 'Full name must be at most 50 characters.'),
    headline: z.string().trim().max(120, 'Headline must be at most 120 characters.'),
    bio: z.string().trim().max(2000, 'About must be at most 2000 characters.'),
    contactEmail: z
      .string()
      .trim()
      .max(255, 'Email must be at most 255 characters.')
      .refine((value) => value === '' || z.email().safeParse(value).success, 'Email address is invalid.'),
    address: z.string().trim().max(255, 'Address must be at most 255 characters.'),
    gender: optionalEnum(GENDERS),
    birthYear: z.string().trim(),
    showPersonalDetails: z.boolean(),
    searchableByRecruiters: z.boolean(),
    jobSearchStatus: z.enum(JOB_SEARCH_STATUSES),
    githubUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    portfolioUrl: optionalUrl,
    desiredRole: z
      .string()
      .trim()
      .min(1, 'Please enter your desired role.')
      .max(120, 'Desired role must be at most 120 characters.'),
    desiredLevel: optionalEnum(CAREER_LEVELS),
    salaryNegotiable: z.boolean(),
    salaryMin: salaryAmount,
    salaryMax: salaryAmount,
    workMode: optionalEnum(WORK_MODES),
    contractType: optionalEnum(CONTRACT_TYPES),
    preferredLocations: z.array(listItem).max(PROFILE_LIST_LIMIT, `Choose at most ${PROFILE_LIST_LIMIT} locations.`),
    preferredIndustries: z.array(listItem).max(PROFILE_LIST_LIMIT, `Choose at most ${PROFILE_LIST_LIMIT} industries.`),
  })
  .superRefine((values, ctx) => {
    if (values.birthYear !== '') {
      const maxYear = new Date().getFullYear() - PROFILE_MIN_AGE;
      const year = Number(values.birthYear);
      if (!/^\d{4}$/.test(values.birthYear) || year < PROFILE_MIN_BIRTH_YEAR || year > maxYear) {
        ctx.addIssue({
          code: 'custom',
          path: ['birthYear'],
          message: `Birth year must be between ${PROFILE_MIN_BIRTH_YEAR} and ${maxYear}.`,
        });
      }
    }
    if (values.salaryNegotiable) return;
    const salaryFields = ['salaryMin', 'salaryMax'] as const;
    const invalid = salaryFields.filter(
      (field) =>
        values[field] !== '' && (!SALARY_PATTERN.test(values[field]) || Number(values[field]) > PROFILE_MAX_SALARY_VND),
    );
    invalid.forEach((field) =>
      ctx.addIssue({
        code: 'custom',
        path: [field],
        message: `Enter a whole amount from 0 to ${PROFILE_MAX_SALARY_VND.toLocaleString('en-US')}.`,
      }),
    );
    const hasRange = invalid.length === 0 && values.salaryMin !== '' && values.salaryMax !== '';
    if (hasRange && Number(values.salaryMin) > Number(values.salaryMax)) {
      ctx.addIssue({
        code: 'custom',
        path: ['salaryMax'],
        message: 'Maximum salary must be greater than or equal to the minimum.',
      });
    }
  });

export type CandidateProfileFormData = z.infer<typeof candidateProfileSchema>;
