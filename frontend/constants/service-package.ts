import type { EntitlementType, ServiceNeedKey } from '@/types/service-package';

export const SERVICE_NEED_MODAL_STORAGE_KEY = 'intervue.services.needModal.dismissed';

export const SERVICE_NEED_OPTIONS: { key: ServiceNeedKey; label: string }[] = [
  { key: 'REACH', label: 'Ad support & increase candidate reach' },
  { key: 'HIGHLIGHT', label: 'Highlight job posts for better candidate response' },
  {
    key: 'BRANDING',
    label: 'Build trusted employer brand and enhance hiring effectiveness',
  },
];

export const SERVICE_NEED_ADMIN_META: Record<
  ServiceNeedKey,
  { label: string; shortLabel: string; summary: string; recruiterChoice: string }
> = {
  REACH: {
    label: 'Candidate reach & ads',
    shortLabel: 'Candidate reach',
    summary: 'Scrolls recruiters looking for broader candidate visibility to this section',
    recruiterChoice: 'Ad support & increase candidate reach',
  },
  HIGHLIGHT: {
    label: 'Job post highlight',
    shortLabel: 'Job highlight',
    summary: 'Scrolls recruiters looking to boost job visibility with badges and highlights',
    recruiterChoice: 'Highlight job posts for better candidate response',
  },
  BRANDING: {
    label: 'Employer branding',
    shortLabel: 'Employer branding',
    summary: 'Scrolls recruiters focused on building employer brand presence',
    recruiterChoice: 'Build trusted employer brand and enhance hiring effectiveness',
  },
};

export const SERVICE_NEED_ADMIN_SELECT_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'None (excluded from suggestion modal)' },
  ...(Object.keys(SERVICE_NEED_ADMIN_META) as ServiceNeedKey[]).map((key) => ({
    value: key,
    label: `${key} — ${SERVICE_NEED_ADMIN_META[key].label}`,
  })),
];

export const SERVICE_NEED_MODAL_COPY = {
  title: 'Suggested package for you',
  description: 'Choose one of your needs below so we can recommend the perfect package for you.',
  dismissLabel: "Don't show this again",
  confirmLabel: 'Confirm',
};

export const SERVICE_IMPORTANT_NOTICE = {
  title: 'Important notice',
  body: 'To avoid fraud risk, InterVue recommends transferring payments only to our official accounts, never to personal accounts.',
};

export const SERVICE_VAT_NOTE = '* Price excludes VAT';

export const SERVICE_BADGE_LABEL: Record<'NEW' | 'SPECIAL_OFFER', string> = {
  NEW: 'NEW',
  SPECIAL_OFFER: 'Special offer',
};

export const SERVICE_CATEGORY_ANCHOR_PREFIX = 'service-category-';

export const ENTITLEMENT_TYPE_OPTIONS: { value: EntitlementType; label: string }[] = [
  { value: 'JOB_POST_SLOT', label: 'Job post slot' },
  { value: 'JOB_LABEL_HOT', label: 'Label: hot' },
  { value: 'JOB_HIGHLIGHT', label: 'Featured job' },
  { value: 'JOB_ALERT_PUSH', label: 'Job alert push' },
  { value: 'AI_RESUME_MATCH', label: 'AI resume match' },
  { value: 'AI_JD_GENERATE', label: 'AI job description' },
  { value: 'BRAND_PAGE', label: 'Brand page' },
  { value: 'FEATURED_COMPANY', label: 'Featured company' },
  { value: 'AD_SLOT_WEEK', label: 'Ad slot week' },
];
