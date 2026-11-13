import type { SaveServiceCategoryInput } from '@/types/admin-service-package';
import { z } from 'zod';

export const CATEGORY_FIELD_LIMITS = {
  code: 50,
  name: 100,
  headline: 255,
  description: 500,
} as const;

export const saveServiceCategorySchema = z.object({
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

export function toSaveServiceCategoryPayload(
  code: string,
  values: SaveServiceCategoryFormData,
): SaveServiceCategoryInput {
  return {
    code,
    name: values.name.trim(),
    headline: values.headline.trim(),
    description: values.description.trim() || null,
    needKey: values.needKey.trim().toUpperCase() || null,
    displayOrder: Number(values.displayOrder),
    isActive: values.isActive,
  };
}

function stripVietnameseDiacritics(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function codeifyCategoryName(name: string): string {
  return stripVietnameseDiacritics(name)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, CATEGORY_FIELD_LIMITS.code);
}

export function resolveUniqueCategoryCode(name: string, existingCodes: Iterable<string>): string {
  const used = new Set(Array.from(existingCodes, (code) => code.toUpperCase()));
  const base = codeifyCategoryName(name) || 'CATEGORY';
  if (!used.has(base)) return base;

  let attempt = 2;
  let candidate = withSuffix(base, attempt);
  while (used.has(candidate)) {
    attempt += 1;
    candidate = withSuffix(base, attempt);
  }
  return candidate;
}

function withSuffix(base: string, attempt: number): string {
  const suffix = `_${attempt}`;
  const maxBaseLength = Math.max(1, CATEGORY_FIELD_LIMITS.code - suffix.length);
  return `${base.slice(0, maxBaseLength)}${suffix}`;
}
