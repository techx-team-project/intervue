import type { AdSlot, CreateAdSlotInput, SaveAdSlotInput } from '@/types/ads';
import { z } from 'zod';

export const AD_SLOT_FIELD_LIMITS = {
  codeMax: 40,
  nameMax: 150,
  descriptionMax: 500,
  urlMax: 500,
  rejectionReasonMax: 500,
} as const;

function isValidUrlOrRelativePath(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isWholePositiveInt(value: string, max?: number): boolean {
  if (!/^\d+$/.test(value.trim())) return false;
  const parsed = Number(value.trim());
  if (!Number.isSafeInteger(parsed) || parsed < 1) return false;
  if (max !== undefined && parsed > max) return false;
  return true;
}

const optionalUrlField = z
  .string()
  .max(AD_SLOT_FIELD_LIMITS.urlMax, `Maximum ${AD_SLOT_FIELD_LIMITS.urlMax} characters`)
  .refine(isValidUrlOrRelativePath, 'Enter a full https:// URL or a site-relative path starting with /');

export const adSlotFormSchema = z
  .object({
    isEditing: z.boolean(),
    code: z
      .string()
      .trim()
      .max(AD_SLOT_FIELD_LIMITS.codeMax, `Code cannot exceed ${AD_SLOT_FIELD_LIMITS.codeMax} characters`),
    name: z
      .string()
      .trim()
      .min(1, 'Slot name is required')
      .max(AD_SLOT_FIELD_LIMITS.nameMax, `Name cannot exceed ${AD_SLOT_FIELD_LIMITS.nameMax} characters`),
    placement: z.enum(['HOME', 'JOBS']),
    description: z
      .string()
      .max(
        AD_SLOT_FIELD_LIMITS.descriptionMax,
        `Description cannot exceed ${AD_SLOT_FIELD_LIMITS.descriptionMax} characters`,
      ),
    width: z
      .string()
      .trim()
      .min(1, 'Width is required')
      .refine((value) => isWholePositiveInt(value, 5000), 'Enter a whole number between 1 and 5,000 px'),
    height: z
      .string()
      .trim()
      .min(1, 'Height is required')
      .refine((value) => isWholePositiveInt(value, 5000), 'Enter a whole number between 1 and 5,000 px'),
    pricePerWeek: z
      .string()
      .trim()
      .min(1, 'Weekly price is required')
      .refine((value) => isWholePositiveInt(value), 'Weekly price must be at least 1 VND'),
    servicePackageId: z.string().trim(),
    houseImageUrl: optionalUrlField,
    houseTargetUrl: optionalUrlField,
    displayOrder: z
      .string()
      .trim()
      .min(1, 'Display order is required')
      .refine((value) => /^\d+$/.test(value), 'Display order must be 0 or greater'),
    active: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (!values.isEditing) {
      if (!values.code) {
        ctx.addIssue({
          code: 'custom',
          path: ['code'],
          message: 'Slot code is required',
        });
      } else if (!/^[A-Z0-9_]+$/.test(values.code)) {
        ctx.addIssue({
          code: 'custom',
          path: ['code'],
          message: 'Use only uppercase letters, numbers, and underscores (e.g. HOME_TOP)',
        });
      }
    }

    if (values.servicePackageId && !isWholePositiveInt(values.servicePackageId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['servicePackageId'],
        message: 'Select a valid service package or leave auto-create selected',
      });
    }
  });

export type AdSlotFormData = z.infer<typeof adSlotFormSchema>;

export function toAdSlotFormDefaults(slot?: AdSlot): AdSlotFormData {
  if (!slot) {
    return {
      isEditing: false,
      code: '',
      name: '',
      placement: 'HOME',
      description: '',
      width: '1200',
      height: '200',
      pricePerWeek: '2500000',
      servicePackageId: '',
      houseImageUrl: '',
      houseTargetUrl: '',
      displayOrder: '0',
      active: true,
    };
  }

  return {
    isEditing: true,
    code: slot.code,
    name: slot.name,
    placement: slot.placement === 'JOBS' ? 'JOBS' : 'HOME',
    description: slot.description ?? '',
    width: String(slot.width),
    height: String(slot.height),
    pricePerWeek: String(slot.pricePerWeek),
    servicePackageId: '',
    houseImageUrl: slot.houseImageUrl ?? '',
    houseTargetUrl: slot.houseTargetUrl ?? '',
    displayOrder: String(slot.displayOrder),
    active: slot.active,
  };
}

function nullableTrimmed(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function toCreateAdSlotPayload(values: AdSlotFormData): CreateAdSlotInput {
  const pkgId = values.servicePackageId.trim();
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    placement: values.placement,
    description: nullableTrimmed(values.description),
    width: Number(values.width),
    height: Number(values.height),
    pricePerWeek: Number(values.pricePerWeek),
    servicePackageId: pkgId ? Number(pkgId) : null,
    houseImageUrl: nullableTrimmed(values.houseImageUrl),
    houseTargetUrl: nullableTrimmed(values.houseTargetUrl),
    displayOrder: Number(values.displayOrder),
    active: values.active,
  };
}

export function toSaveAdSlotPayload(values: AdSlotFormData): SaveAdSlotInput {
  return {
    name: values.name.trim(),
    description: nullableTrimmed(values.description),
    pricePerWeek: Number(values.pricePerWeek),
    houseImageUrl: nullableTrimmed(values.houseImageUrl),
    houseTargetUrl: nullableTrimmed(values.houseTargetUrl),
    displayOrder: Number(values.displayOrder),
    active: values.active,
  };
}

export const rejectCreativeSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(5, 'Please provide a clear reason (at least 5 characters) so the recruiter knows what to fix')
    .max(
      AD_SLOT_FIELD_LIMITS.rejectionReasonMax,
      `Reason cannot exceed ${AD_SLOT_FIELD_LIMITS.rejectionReasonMax} characters`,
    ),
});

export type RejectCreativeFormData = z.infer<typeof rejectCreativeSchema>;
