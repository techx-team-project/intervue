import {
  SECTION_MAX_YEAR_AHEAD,
  SECTION_MIN_YEAR,
  SECTION_TAG_LIMIT,
  SECTION_TEXT_LIMIT,
  SKILL_MAX_YEARS,
} from '@/constants/candidate-profile';
import { LANGUAGE_PROFICIENCIES, SKILL_CATEGORIES, SKILL_LEVELS } from '@/types/candidate-profile';
import { z } from 'zod';

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const YEAR_PATTERN = /^\d{4}$/;

const text = (label: string, max: number) => z.string().trim().max(max, `${label} must be at most ${max} characters.`);
const longText = (label: string) => text(label, SECTION_TEXT_LIMIT);
const required = (label: string, max: number) => text(label, max).min(1, `Please enter ${label.toLowerCase()}.`);

const optionalUrl = z
  .string()
  .trim()
  .max(255, 'Link must be at most 255 characters.')
  .refine((value) => value === '' || /^https?:\/\/.+/.test(value), 'Link must start with http:// or https://.');

const currentMonth = () => new Date().toISOString().slice(0, 7);
const monthInRange = (value: string) =>
  MONTH_PATTERN.test(value) && value >= `${SECTION_MIN_YEAR}-01` && value <= currentMonth();
const MONTH_RANGE_MESSAGE = `Pick a month between ${SECTION_MIN_YEAR}-01 and today.`;

const optionalMonth = z.string().refine((value) => value === '' || monthInRange(value), MONTH_RANGE_MESSAGE);
const requiredMonth = z.string().refine(monthInRange, MONTH_RANGE_MESSAGE);

const tags = z
  .array(z.string().trim().min(1).max(60, 'Each item must be at most 60 characters.'))
  .max(SECTION_TAG_LIMIT, `Add at most ${SECTION_TAG_LIMIT} items.`);

const dateRange = {
  startDate: requiredMonth,
  endDate: optionalMonth,
  current: z.boolean(),
};

export type DateRangeValues = { startDate: string; endDate: string; current: boolean };

function checkDateRange(values: DateRangeValues, ctx: z.RefinementCtx) {
  if (values.current || values.endDate === '' || values.startDate === '') return;
  if (values.endDate < values.startDate) {
    ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'End date must be on or after the start date.' });
  }
}

export const candidateExperienceSchema = z
  .object({
    title: required('Job title', 120),
    companyName: required('Company', 150),
    location: text('Location', 100),
    ...dateRange,
    description: longText('Description'),
    achievements: longText('Achievements'),
    skills: tags,
  })
  .superRefine(checkDateRange);

export const candidateProjectSchema = z
  .object({
    name: required('Project name', 150),
    role: text('Role', 100),
    ...dateRange,
    description: longText('Description'),
    highlights: longText('Highlights'),
    githubUrl: optionalUrl,
    demoUrl: optionalUrl,
    technologies: tags,
  })
  .superRefine(checkDateRange);

export const candidateEducationSchema = z
  .object({
    school: required('School', 150),
    degree: text('Degree', 100),
    major: text('Major', 150),
    startYear: z.string().trim(),
    endYear: z.string().trim(),
    gpa: text('GPA', 20),
    achievements: longText('Achievements'),
  })
  .superRefine((values, ctx) => {
    const maxYear = new Date().getFullYear() + SECTION_MAX_YEAR_AHEAD;
    const message = `Year must be between ${SECTION_MIN_YEAR} and ${maxYear}.`;
    const valid = (value: string) =>
      YEAR_PATTERN.test(value) && Number(value) >= SECTION_MIN_YEAR && Number(value) <= maxYear;
    if (!valid(values.startYear)) ctx.addIssue({ code: 'custom', path: ['startYear'], message });
    if (values.endYear !== '' && !valid(values.endYear)) ctx.addIssue({ code: 'custom', path: ['endYear'], message });
    if (valid(values.startYear) && valid(values.endYear) && Number(values.endYear) < Number(values.startYear)) {
      ctx.addIssue({ code: 'custom', path: ['endYear'], message: 'End year must be on or after the start year.' });
    }
  });

export const candidateCertificationSchema = z.object({
  name: required('Certificate name', 150),
  issuer: required('Issuing organization', 150),
  issueDate: optionalMonth,
  credentialId: text('Credential ID', 100),
  credentialUrl: optionalUrl,
});

export const candidateLanguageSchema = z.object({
  language: required('Language', 60),
  proficiency: z.enum(LANGUAGE_PROFICIENCIES),
  certificate: text('Certificate', 100),
});

export const candidateSkillSchema = z.object({
  name: required('Skill name', 60),
  category: z.enum(SKILL_CATEGORIES),
  level: z.enum(SKILL_LEVELS),
  years: z
    .string()
    .trim()
    .refine(
      (value) => /^\d{1,2}$/.test(value) && Number(value) <= SKILL_MAX_YEARS,
      `Years must be a whole number from 0 to ${SKILL_MAX_YEARS}.`,
    ),
});

export type CandidateExperienceFormData = z.infer<typeof candidateExperienceSchema>;
export type CandidateProjectFormData = z.infer<typeof candidateProjectSchema>;
export type CandidateEducationFormData = z.infer<typeof candidateEducationSchema>;
export type CandidateCertificationFormData = z.infer<typeof candidateCertificationSchema>;
export type CandidateLanguageFormData = z.infer<typeof candidateLanguageSchema>;
export type CandidateSkillFormData = z.infer<typeof candidateSkillSchema>;
