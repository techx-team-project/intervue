import { z } from 'zod';

export const jobLevelSchema = z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']);
export const contractTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP']);
export const workingArrangementSchema = z.enum(['ON_SITE', 'HYBRID', 'REMOTE', 'FLEXIBLE']);
export const salaryCurrencySchema = z.enum(['VND', 'USD']);
export const salaryBasisSchema = z.enum(['GROSS', 'NET']);
export const jobRoleSchema = z.enum(
  ['BACKEND', 'FRONTEND', 'FULLSTACK', 'MOBILE', 'DEVOPS', 'QA', 'DATA_AI', 'BA', 'PM', 'UIUX', 'SECURITY', 'OTHER'],
  { error: 'Select a job role.' },
);
export const jobBenefitTagSchema = z.enum([
  'HEALTH_INSURANCE',
  'BONUS_13TH_MONTH',
  'PERFORMANCE_BONUS',
  'LAPTOP',
  'TRAINING',
  'TEAM_BUILDING',
  'FLEXIBLE_HOURS',
  'REMOTE_DAYS',
  'ANNUAL_LEAVE',
  'MEALS',
]);

export const JOB_MAX_BENEFIT_TAGS = 10;
export const JOB_MAX_HIRING_STEPS = 6;
export const JOB_MAX_EXPERIENCE_YEARS = 30;

export const screeningQuestionTypeSchema = z.enum(['CHOICE', 'SHORT_TEXT']);

export const SCREENING_MAX_QUESTIONS = 5;
export const SCREENING_MIN_OPTIONS = 2;
export const SCREENING_MAX_OPTIONS = 6;

export const screeningQuestionSchema = z
  .object({
    type: screeningQuestionTypeSchema,
    prompt: z.string().trim().min(1, 'Enter the question.').max(300, 'Maximum 300 characters.'),
    required: z.boolean(),
    options: z.array(z.string().trim().min(1).max(100, 'Each option allows at most 100 characters.')),
  })
  .superRefine((question, ctx) => {
    if (question.type !== 'CHOICE') return;
    const distinct = new Set(question.options.map((option) => option.toLowerCase()));
    if (
      question.options.length < SCREENING_MIN_OPTIONS ||
      question.options.length > SCREENING_MAX_OPTIONS ||
      distinct.size !== question.options.length
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: `Provide ${SCREENING_MIN_OPTIONS}-${SCREENING_MAX_OPTIONS} distinct options.`,
      });
    }
  });

export const skillOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const jobPostSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Title must be at least 5 characters.')
      .max(150, 'Title allows at most 150 characters.'),
    level: jobLevelSchema,
    jobRole: jobRoleSchema.optional(),
    experienceMinYears: z
      .number()
      .int('Enter a whole number.')
      .min(0, 'Minimum 0.')
      .max(JOB_MAX_EXPERIENCE_YEARS, 'Maximum 30 years.')
      .optional(),
    experienceMaxYears: z
      .number()
      .int('Enter a whole number.')
      .min(0, 'Minimum 0.')
      .max(JOB_MAX_EXPERIENCE_YEARS, 'Maximum 30 years.')
      .optional(),
    contractType: contractTypeSchema,
    workingArrangement: workingArrangementSchema,
    city: z.string().trim().min(1, 'Enter the work location.').max(100, 'Maximum 100 characters.'),
    address: z.string().trim().max(500, 'Maximum 500 characters.'),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    salaryNegotiable: z.boolean(),
    salaryMin: z.number().positive('Enter a number greater than 0.').optional(),
    salaryMax: z.number().positive('Enter a number greater than 0.').optional(),
    currency: salaryCurrencySchema,
    salaryBasis: salaryBasisSchema,
    skills: z.array(skillOptionSchema).min(1, 'Select at least 1 skill.').max(20, 'Maximum 20 skills.'),
    description: z.string().trim().min(50, 'Description must be at least 50 characters.'),
    requirements: z.string().trim().min(20, 'Requirements must be at least 20 characters.'),
    benefits: z.string().trim(),
    benefitTags: z.array(jobBenefitTagSchema).max(JOB_MAX_BENEFIT_TAGS),
    hiringSteps: z
      .array(z.object({ title: z.string().trim().min(1, 'Enter the step name.').max(80, 'Maximum 80 characters.') }))
      .max(JOB_MAX_HIRING_STEPS),
    deadline: z.string().min(1, 'Select an application deadline.'),
    screeningQuestions: z.array(screeningQuestionSchema).max(SCREENING_MAX_QUESTIONS),
    openings: z.number().int('Enter a whole number.').min(1, 'Minimum 1 opening.').max(1000, 'Maximum 1000 openings.'),
  })
  .refine((data) => data.jobRole !== undefined, { message: 'Select a job role.', path: ['jobRole'] })
  .refine(
    (data) =>
      data.experienceMinYears === undefined ||
      data.experienceMaxYears === undefined ||
      data.experienceMinYears <= data.experienceMaxYears,
    { message: 'Minimum years cannot exceed maximum years.', path: ['experienceMinYears'] },
  )
  .refine((data) => data.salaryNegotiable || (data.salaryMin !== undefined && data.salaryMax !== undefined), {
    message: 'Enter a salary range or choose Negotiable.',
    path: ['salaryMax'],
  })
  .refine(
    (data) =>
      data.salaryNegotiable ||
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: 'Minimum salary cannot exceed maximum salary.',
      path: ['salaryMin'],
    },
  );

export type JobPostFormData = z.infer<typeof jobPostSchema>;
export type ScreeningQuestionFormData = z.infer<typeof screeningQuestionSchema>;
export type SkillOption = z.infer<typeof skillOptionSchema>;
