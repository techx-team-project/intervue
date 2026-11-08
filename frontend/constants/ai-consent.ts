/**
 * AI Personal Data Processing Consent Configuration Pursuant to Decree No. 13/2023/ND-CP on Personal Data Protection.
 *
 * Keep all consent text, versioning, and policy sections in this single constant.
 */
export const AI_PERSONAL_DATA_CONSENT_STORAGE_KEY = 'intervue_ai_personal_data_consent';

export const AI_PERSONAL_DATA_CONSENT_CONFIG = {
  version: '1.0.0',
  lastUpdated: '2026-11-05',
  badgeText: 'Compliant with Decree 13/2023/ND-CP',
  title: 'Consent to personal data processing for AI features',
  summary:
    'To use Artificial Intelligence (AI) features that parse CVs, assess fit and suggest jobs, InterVue needs your explicit consent to process personal data as required by law.',
  sections: [
    {
      heading: '1. Scope of personal data collected',
      details:
        'Includes the information in the CV you upload (name, email, phone number, work history, education, skills, projects) and the career preferences you set.',
    },
    {
      heading: '2. Purpose of AI processing',
      details:
        'Extracting text from your CV, suggesting profile fields, checking fit with job posts and giving objective CV improvement feedback.',
    },
    {
      heading: '3. Security commitment & AI ethics',
      details:
        'InterVue will not share or sell personal data to unauthorized third parties. AI never uses sensitive attributes (age, gender, photo, place of origin) in any assessment.',
    },
    {
      heading: '4. Data subject rights & duration',
      details:
        'Your consent applies to the current policy version. You may review, correct or delete your data, or withdraw this consent at any time in Account settings.',
    },
  ],
  notice: 'If you do not agree, you can keep using InterVue standard features and update your profile manually.',
  confirmButtonText: 'Agree and continue',
  cancelButtonText: 'Later (enter manually)',
} as const;

export type AiPersonalDataConsentConfig = typeof AI_PERSONAL_DATA_CONSENT_CONFIG;
