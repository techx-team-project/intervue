import type { AdminServicePackage, SaveServicePackageInput, ServicePackageStatus } from '@/types/admin-service-package';
import type { EntitlementType, ServicePackageBadge } from '@/types/service-package';
import { z } from 'zod';

export const PACKAGE_FIELD_LIMITS = {
  code: 50,
  slug: 120,
  name: 150,
  shortDescription: 1000,
  currency: 3,
  accentColor: 20,
  imageUrl: 500,
  benefitLabel: 255,
  sectionHeading: 255,
  iconName: 50,
} as const;

export const ENTITLEMENT_TYPES = [
  'JOB_POST_SLOT',
  'JOB_BOOST',
  'JOB_LABEL_URGENT',
  'JOB_LABEL_HOT',
  'JOB_HIGHLIGHT',
  'JOB_RETOP',
  'JOB_ALERT_PUSH',
  'AI_RESUME_MATCH',
  'AI_JD_GENERATE',
  'BRAND_PAGE',
  'FEATURED_COMPANY',
  'AD_SLOT_WEEK',
  'CREDIT',
] as const satisfies readonly EntitlementType[];

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function isValidImageUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith('/')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

const optionalHexColorSchema = z
  .string()
  .trim()
  .max(PACKAGE_FIELD_LIMITS.accentColor, `Color must be at most ${PACKAGE_FIELD_LIMITS.accentColor} characters.`)
  .refine((value) => !value || HEX_COLOR_REGEX.test(value), 'Use a valid hex color such as #16a34a.');

const optionalImageUrlSchema = z
  .string()
  .trim()
  .max(PACKAGE_FIELD_LIMITS.imageUrl, `Image URL must be at most ${PACKAGE_FIELD_LIMITS.imageUrl} characters.`)
  .refine(isValidImageUrl, 'Enter a valid http(s) URL or upload an image.');

export const DURATION_REQUIRED_ENTITLEMENT_TYPES = new Set<EntitlementType>([
  'JOB_POST_SLOT',
  'JOB_BOOST',
  'JOB_LABEL_URGENT',
  'JOB_LABEL_HOT',
  'JOB_HIGHLIGHT',
  'BRAND_PAGE',
  'FEATURED_COMPANY',
  'AD_SLOT_WEEK',
]);

export const packageBenefitSchema = z
  .object({
    entitlementType: z.enum(ENTITLEMENT_TYPES),
    quantity: z
      .string()
      .trim()
      .min(1, 'Quantity is required.')
      .refine((value) => /^[1-9]\d*$/.test(value), 'Quantity must be at least 1.'),
    tier: z
      .string()
      .trim()
      .refine((value) => /^[1-3]$/.test(value), 'Tier must be between 1 and 3.'),
    durationDays: z
      .string()
      .trim()
      .refine((value) => !value || /^[1-9]\d*$/.test(value), 'Duration must be at least 1 day.'),
    label: z
      .string()
      .trim()
      .min(1, 'Recruiter-facing label is required.')
      .max(PACKAGE_FIELD_LIMITS.benefitLabel, `Label must be at most ${PACKAGE_FIELD_LIMITS.benefitLabel} characters.`),
  })
  .superRefine((benefit, ctx) => {
    if (benefit.entitlementType !== 'JOB_BOOST' && benefit.tier !== '1') {
      ctx.addIssue({
        code: 'custom',
        path: ['tier'],
        message: 'Only JOB_BOOST supports tiers 1–3; other types must use tier 1.',
      });
    }
    if (DURATION_REQUIRED_ENTITLEMENT_TYPES.has(benefit.entitlementType) && !benefit.durationDays.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['durationDays'],
        message: 'Duration is required for time-boxed benefits.',
      });
    }
  });

export const packageSectionSchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, 'Section heading is required.')
    .max(
      PACKAGE_FIELD_LIMITS.sectionHeading,
      `Heading must be at most ${PACKAGE_FIELD_LIMITS.sectionHeading} characters.`,
    ),
  iconName: z
    .string()
    .trim()
    .max(PACKAGE_FIELD_LIMITS.iconName, `Icon name must be at most ${PACKAGE_FIELD_LIMITS.iconName} characters.`),
  accentColor: optionalHexColorSchema,
  body: z.string(),
  imageUrl: optionalImageUrlSchema,
});

export const saveServicePackageSchema = z.object({
  categoryId: z
    .string()
    .trim()
    .min(1, 'Category is required.')
    .refine((value) => /^[1-9]\d*$/.test(value), 'Select a valid category.'),
  name: z
    .string()
    .trim()
    .min(1, 'Package name is required.')
    .max(PACKAGE_FIELD_LIMITS.name, `Name must be at most ${PACKAGE_FIELD_LIMITS.name} characters.`),
  code: z
    .string()
    .trim()
    .min(1, 'Package code is required.')
    .max(PACKAGE_FIELD_LIMITS.code, `Code must be at most ${PACKAGE_FIELD_LIMITS.code} characters.`)
    .regex(/^[A-Za-z0-9_]+$/, 'Use letters, digits and underscores only (e.g. PRO_MAX).'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .max(PACKAGE_FIELD_LIMITS.slug, `Slug must be at most ${PACKAGE_FIELD_LIMITS.slug} characters.`)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, digits and dashes only (e.g. pro-max).'),
  shortDescription: z
    .string()
    .trim()
    .max(
      PACKAGE_FIELD_LIMITS.shortDescription,
      `Short description must be at most ${PACKAGE_FIELD_LIMITS.shortDescription} characters.`,
    ),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required.')
    .refine((value) => /^\d+$/.test(value), 'Price must be a whole non-negative number.'),
  currency: z.string().trim().max(PACKAGE_FIELD_LIMITS.currency),
  badge: z.enum(['NONE', 'NEW', 'SPECIAL_OFFER']),
  vipRibbon: z.boolean(),
  accentColor: optionalHexColorSchema,
  validityDays: z
    .string()
    .trim()
    .refine((value) => !value || /^[1-9]\d*$/.test(value), 'Validity must be at least 1 day.'),
  bonusCredits: z
    .string()
    .trim()
    .min(1, 'Bonus credits must be 0 or greater.')
    .refine((value) => /^\d+$/.test(value), 'Bonus credits must be a whole number (0 or greater).'),
  oneTimePerCompany: z.boolean(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']),
  displayOrder: z
    .string()
    .trim()
    .min(1, 'Display order is required.')
    .refine((value) => /^\d+$/.test(value), 'Display order must be a whole number (0 or greater).'),
  benefits: z.array(packageBenefitSchema),
  sections: z.array(packageSectionSchema),
});

export type SaveServicePackageFormData = z.infer<typeof saveServicePackageSchema>;
export type PackageBenefitFormData = z.infer<typeof packageBenefitSchema>;
export type PackageSectionFormData = z.infer<typeof packageSectionSchema>;

function stripVietnameseDiacritics(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function slugifyPackageName(value: string): string {
  return stripVietnameseDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, PACKAGE_FIELD_LIMITS.slug);
}

export function codeifyPackageName(value: string): string {
  return stripVietnameseDiacritics(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, PACKAGE_FIELD_LIMITS.code);
}

export function toPackageFormDefaults(
  initial: AdminServicePackage | undefined,
  defaultCategoryId: number | string,
  suggestedDisplayOrder: number,
): SaveServicePackageFormData {
  return {
    categoryId: String(initial?.categoryId ?? defaultCategoryId ?? ''),
    name: initial?.name ?? '',
    code: initial?.code ?? '',
    slug: initial?.slug ?? '',
    shortDescription: initial?.shortDescription ?? '',
    price: initial ? String(initial.price) : '',
    currency: initial?.currency ?? 'VND',
    badge: (initial?.badge ?? 'NONE') as ServicePackageBadge,
    vipRibbon: initial?.vipRibbon ?? false,
    accentColor: initial?.accentColor ?? '',
    validityDays: initial?.validityDays ? String(initial.validityDays) : '',
    bonusCredits: String(initial?.bonusCredits ?? 0),
    oneTimePerCompany: initial?.oneTimePerCompany ?? false,
    status: (initial?.status ?? 'DRAFT') as ServicePackageStatus,
    displayOrder: String(initial?.displayOrder ?? suggestedDisplayOrder),
    benefits:
      initial?.benefits.map((benefit) => ({
        entitlementType: benefit.entitlementType,
        quantity: String(benefit.quantity),
        tier: String(benefit.tier ?? 1),
        durationDays: benefit.durationDays ? String(benefit.durationDays) : '',
        label: benefit.label,
      })) ?? [],
    sections:
      initial?.sections.map((section) => ({
        heading: section.heading,
        iconName: section.iconName ?? '',
        accentColor: section.accentColor ?? '',
        body: section.body ?? '',
        imageUrl: section.imageUrl ?? '',
      })) ?? [],
  };
}

export function toSaveServicePackagePayload(values: SaveServicePackageFormData): SaveServicePackageInput {
  return {
    categoryId: Number(values.categoryId),
    code: values.code.trim().toUpperCase(),
    slug: values.slug.trim().toLowerCase(),
    name: values.name.trim(),
    shortDescription: values.shortDescription.trim() || null,
    price: Number(values.price),
    currency: values.currency.trim().toUpperCase() || 'VND',
    badge: values.badge,
    vipRibbon: values.vipRibbon,
    accentColor: values.accentColor.trim() || null,
    heroImageUrl: null,
    validityDays: values.validityDays.trim() ? Number(values.validityDays) : null,
    bonusCredits: Number(values.bonusCredits),
    oneTimePerCompany: values.oneTimePerCompany,
    status: values.status,
    displayOrder: Number(values.displayOrder),
    benefits: values.benefits.map((benefit) => ({
      entitlementType: benefit.entitlementType,
      quantity: Number(benefit.quantity),
      tier: benefit.entitlementType === 'JOB_BOOST' ? Number(benefit.tier) : 1,
      durationDays: benefit.durationDays.trim() ? Number(benefit.durationDays) : null,
      label: benefit.label.trim(),
    })),
    sections: values.sections.map((section) => ({
      heading: section.heading.trim(),
      iconName: section.iconName.trim() || null,
      accentColor: section.accentColor.trim() || null,
      body: section.body.trim() || null,
      imageUrl: section.imageUrl.trim() || null,
    })),
  };
}

interface BuildSamplePackageOptions {
  categoryId: string;
  displayOrder: number;
  existingPackages?: AdminServicePackage[];
  existingSectionImageUrls?: string[];
}

export function buildSamplePackageFormData({
  categoryId,
  displayOrder,
  existingPackages = [],
  existingSectionImageUrls = [],
}: BuildSamplePackageOptions): SaveServicePackageFormData {
  const takenCodes = new Set(existingPackages.map((item) => item.code.toUpperCase()));
  const takenSlugs = new Set(existingPackages.map((item) => item.slug.toLowerCase()));

  let suffix = '';
  let attempt = 1;
  while (
    takenCodes.has(`TOP_BOOST_PLUS${suffix ? `_${suffix}` : ''}`) ||
    takenSlugs.has(`top-boost-plus${suffix ? `-${suffix}` : ''}`)
  ) {
    attempt += 1;
    suffix = String(attempt);
  }

  return {
    categoryId,
    name: suffix ? `TOP BOOST PLUS ${suffix}` : 'TOP BOOST PLUS',
    code: suffix ? `TOP_BOOST_PLUS_${suffix}` : 'TOP_BOOST_PLUS',
    slug: suffix ? `top-boost-plus-${suffix}` : 'top-boost-plus',
    shortDescription:
      'Đẩy tin tuyển dụng IT lên vị trí ưu tiên nổi bật, kết hợp AI Resume Match và nhãn HOT giúp tăng gấp đôi lượng hồ sơ chất lượng.',
    price: '5900000',
    currency: 'VND',
    badge: 'SPECIAL_OFFER',
    vipRibbon: true,
    accentColor: '#16a34a',
    validityDays: '30',
    bonusCredits: '200',
    oneTimePerCompany: false,
    status: 'ACTIVE',
    displayOrder: String(displayOrder),
    benefits: [
      {
        entitlementType: 'JOB_POST_SLOT',
        quantity: '3',
        tier: '1',
        durationDays: '30',
        label: '03 tin tuyển dụng hiển thị trong 30 ngày',
      },
      {
        entitlementType: 'JOB_BOOST',
        quantity: '3',
        tier: '2',
        durationDays: '30',
        label: 'Vị trí hiển thị ưu tiên cấp 2 trong danh sách việc làm',
      },
      {
        entitlementType: 'JOB_LABEL_HOT',
        quantity: '2',
        tier: '1',
        durationDays: '7',
        label: 'Gắn nhãn HOT thu hút ứng viên cho 02 tin trong 7 ngày',
      },
      {
        entitlementType: 'AI_RESUME_MATCH',
        quantity: '200',
        tier: '1',
        durationDays: '',
        label: '200 lượt AI phân tích và đối chiếu CV ứng viên',
      },
      {
        entitlementType: 'CREDIT',
        quantity: '200',
        tier: '1',
        durationDays: '',
        label: 'Tặng kèm 200 Credits quy đổi tiện ích linh hoạt',
      },
    ],
    sections: [
      {
        heading: 'Hiển thị ưu tiên & nhãn HOT nổi bật trên trang Việc làm IT',
        iconName: 'zap',
        accentColor: '#16a34a',
        body: '- Tin tuyển dụng được ưu tiên xếp ở nhóm đầu kết quả tìm kiếm **Việc làm IT**.\n- Kết hợp nhãn **HOT** trong 7 ngày đầu để tăng tỷ lệ nhấp và nộp CV.\n- Phù hợp cho chiến dịch tuyển lập trình viên cần tốc độ.',
        imageUrl: existingSectionImageUrls[0] ?? '',
      },
      {
        heading: 'AI Resume Match & quà tặng 200 Credits linh hoạt',
        iconName: 'sparkles',
        accentColor: '#2563eb',
        body: '- Sử dụng **200 lượt AI Resume Match** để tự động chấm điểm mức độ phù hợp của từng hồ sơ với JD.\n- Ví **200 Credits** tặng kèm giúp quy đổi thêm lượt đẩy tin hoặc nhãn nổi bật khi cần.',
        imageUrl: existingSectionImageUrls[1] ?? '',
      },
    ],
  };
}
