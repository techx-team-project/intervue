import type { SaveServiceCategoryInput } from '@/types/admin-service-package';
import { z } from 'zod';

export const CATEGORY_FIELD_LIMITS = {
  code: 50,
  name: 100,
  headline: 255,
  description: 500,
} as const;

export const saveServiceCategorySchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Category code is required.')
    .max(CATEGORY_FIELD_LIMITS.code, `Code must be at most ${CATEGORY_FIELD_LIMITS.code} characters.`)
    .regex(/^[A-Za-z0-9_]+$/, 'Use letters, digits and underscores only (e.g. TOP_JOBS).'),
  name: z
    .string()
    .trim()
    .min(1, 'Display name is required.')
    .max(CATEGORY_FIELD_LIMITS.name, `Name must be at most ${CATEGORY_FIELD_LIMITS.name} characters.`),
  headline: z
    .string()
    .trim()
    .min(1, 'Section headline is required.')
    .max(CATEGORY_FIELD_LIMITS.headline, `Headline must be at most ${CATEGORY_FIELD_LIMITS.headline} characters.`),
  description: z
    .string()
    .trim()
    .max(
      CATEGORY_FIELD_LIMITS.description,
      `Description must be at most ${CATEGORY_FIELD_LIMITS.description} characters.`,
    ),
  needKey: z.string().trim().max(50, 'Need key must be at most 50 characters.'),
  displayOrder: z
    .string()
    .trim()
    .min(1, 'Display order is required.')
    .refine((value) => /^\d+$/.test(value), 'Display order must be a whole number (0 or greater).'),
  isActive: z.boolean(),
});

export type SaveServiceCategoryFormData = z.infer<typeof saveServiceCategorySchema>;

export function toSaveServiceCategoryPayload(values: SaveServiceCategoryFormData): SaveServiceCategoryInput {
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    headline: values.headline.trim(),
    description: values.description.trim() || null,
    needKey: values.needKey.trim().toUpperCase() || null,
    displayOrder: Number(values.displayOrder),
    isActive: values.isActive,
  };
}
