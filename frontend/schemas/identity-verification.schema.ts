import { z } from 'zod';

export const IDENTITY_MIN_AGE = 16;
export const IDENTITY_MIN_BIRTH_DATE = '1950-01-01';
export const IDENTITY_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const IDENTITY_ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

function latestBirthDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - IDENTITY_MIN_AGE);
  return date.toISOString().slice(0, 10);
}

export const identityDocumentSchema = z
  .instanceof(File, { message: 'Please choose an image.' })
  .refine((file) => IDENTITY_ACCEPTED_TYPES.includes(file.type), 'Only JPG or PNG images are accepted.')
  .refine((file) => file.size <= IDENTITY_MAX_FILE_BYTES, 'The image can be at most 5 MB.');

export const identityVerificationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter the full name on the document.')
    .max(120, 'Keep the name under 120 characters.'),
  idNumber: z
    .string()
    .trim()
    .regex(/^(\d{9}|\d{12})$/, 'The ID number has 12 digits (or 9 digits for an old ID card).'),
  dateOfBirth: z
    .string()
    .min(1, 'Pick the date of birth.')
    .refine((value) => value >= IDENTITY_MIN_BIRTH_DATE, 'Pick a realistic date of birth.')
    .refine((value) => value <= latestBirthDate(), `You must be at least ${IDENTITY_MIN_AGE} years old.`),
  front: identityDocumentSchema,
  back: identityDocumentSchema,
  selfie: identityDocumentSchema,
});

export type IdentityVerificationFormValues = z.infer<typeof identityVerificationSchema>;

export const identityMaxBirthDate = latestBirthDate;
