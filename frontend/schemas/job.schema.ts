import { z } from 'zod';

export const jobLevelSchema = z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']);
export const contractTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP']);
export const workingArrangementSchema = z.enum(['ON_SITE', 'HYBRID', 'REMOTE', 'FLEXIBLE']);

export const screeningQuestionSchema = z
  .object({
    id: z.string(),
    question: z
      .string()
      .trim()
      .min(3, 'Please enter the question.')
      .max(200, 'Question must be at most 200 characters.'),
    required: z.boolean(),
    type: z.enum(['TEXT', 'YES_NO', 'SINGLE_CHOICE']),
    options: z.array(z.string().trim().min(1)).optional(),
  })
  .refine((data) => data.type !== 'SINGLE_CHOICE' || (data.options?.length ?? 0) >= 2, {
    message: 'Add at least 2 options for a single-choice question.',
    path: ['options'],
  });

export const jobPostSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Title must be at least 5 characters.')
      .max(150, 'Title must be at most 150 characters.'),
    level: jobLevelSchema,
    contractType: contractTypeSchema,
    workingArrangement: workingArrangementSchema,
    location: z.object({
      city: z.string().trim().min(1, 'Please enter the city.'),
      district: z.string().trim().optional(),
      specificAddress: z.string().trim().optional(),
    }),
    salary: z.object({
      negotiable: z.boolean(),
      min: z.number().int().positive().optional(),
      max: z.number().int().positive().optional(),
      currency: z.enum(['VND', 'USD']).optional(),
      period: z.literal('MONTHLY').optional(),
    }),
    skills: z.array(z.string().trim().min(1)).min(1, 'Add at least 1 skill.'),
    description: z.string().trim().min(50, 'Description must be at least 50 characters.'),
    requirements: z.string().trim().min(20, 'Requirements must be at least 20 characters.'),
    benefits: z.string().trim().min(10, 'Benefits must be at least 10 characters.'),
    screeningQuestions: z.array(screeningQuestionSchema),
  })
  .refine((data) => data.salary.negotiable || (data.salary.min !== undefined && data.salary.max !== undefined), {
    message: 'Enter a salary range or mark it as negotiable.',
    path: ['salary', 'max'],
  })
  .refine(
    (data) =>
      data.salary.negotiable ||
      data.salary.min === undefined ||
      data.salary.max === undefined ||
      data.salary.min <= data.salary.max,
    {
      message: 'Minimum salary must not exceed the maximum.',
      path: ['salary', 'min'],
    },
  );

export type JobPostFormData = z.infer<typeof jobPostSchema>;
export type ScreeningQuestionFormData = z.infer<typeof screeningQuestionSchema>;
