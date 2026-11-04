export const VERIFICATION_LEVEL_PERKS = [
  {
    level: 1,
    title: 'Level 1: Basic Account',
    description: 'Email verified. Explore the platform, configure hiring needs, and create up to 3 draft job listings.',
    badges: ['Account exploration', 'Draft jobs (up to 3)', 'Basic company profile setup'],
    restrictions: ['Cannot publish jobs to public board', 'Cannot receive candidate applications'],
    isCurrent: false,
  },
  {
    level: 2,
    title: 'Level 2: Standard Employer',
    description:
      'Phone verified + Company linked + Data protection agreements accepted. Prepare unlimited drafts and explore candidate talent.',
    badges: ['Unlimited draft jobs', 'AI Job Description generator', 'Explore candidate directory'],
    restrictions: [
      'Cannot publish jobs to public board',
      'Cannot receive candidate applications or contact talent directly',
    ],
    isCurrent: false,
  },
  {
    level: 3,
    title: 'Level 3: Verified Enterprise',
    description:
      'Company verified + Business document approved by Admin. Unlocks full public publishing, trust badge, and candidate pipeline.',
    badges: [
      'Official Verified Employer green badge',
      'Publish active job postings to public board',
      'Receive and review candidate CV applications',
      'Direct candidate chat and interview pipeline',
      'Priority ranking in search results',
    ],
    restrictions: [],
    isCurrent: false,
  },
] as const;

export const VERIFICATION_STEPS_META = [
  {
    id: 'PHONE' as const,
    order: 1,
    title: 'Verify phone number',
    description: 'Secure your recruiter account with personal mobile OTP verification.',
    badgeLabel: 'Identity verification',
    actionLabel: 'Verify phone',
  },
  {
    id: 'COMPANY' as const,
    order: 2,
    title: 'Company profile & binding',
    description: 'Link your registered business details, tax ID, and official address.',
    badgeLabel: 'Business profile',
    actionLabel: 'Update profile',
  },
  {
    id: 'LICENSE' as const,
    order: 3,
    title: 'Business License / Authorization',
    description: 'Upload Enterprise Registration Certificate (Owner) or Letter of Authorization (Member).',
    badgeLabel: 'Legal representation',
    actionLabel: 'Upload document',
  },
  {
    id: 'CANDIDATE_AGREEMENT' as const,
    order: 4,
    title: 'Candidate Data Processing Agreement',
    description: 'Commit to lawful processing of candidate CVs and personal data under Decree 13/2023/ND-CP.',
    badgeLabel: 'Data privacy',
    actionLabel: 'Review agreement',
  },
  {
    id: 'PLATFORM_AGREEMENT' as const,
    order: 5,
    title: 'InterVue Platform Service Agreement',
    description: 'Consent to recruitment platform terms and mutual data security obligations with InterVue.',
    badgeLabel: 'Platform terms',
    actionLabel: 'Review agreement',
  },
] as const;

export const STANDARD_CANDIDATE_AGREEMENT_PREVIEW = `
INTERVUE DATA PROCESSING AGREEMENT WITH CANDIDATES
(Pursuant to Decree No. 13/2023/ND-CP on Personal Data Protection)

1. Purpose of Processing
The Employer commits to collecting, storing, and processing candidate personal data (including Curriculum Vitae, contact details, work history, education, and screening responses) solely for the legitimate purpose of recruitment and evaluation for positions posted on the InterVue platform.

2. Scope and Retention
- Candidate data shall be retained strictly during the active recruitment cycle and subsequent statutory retention periods.
- Data shall not be transferred, disclosed, or commercialized to any unauthorized third parties without explicit consent.

3. Candidate Rights
Candidates retain the right to be informed, review, request rectification, or request erasure of their submitted application data in accordance with statutory privacy provisions.

4. Confidentiality and Security
The Employer implements rigorous technical and organizational security measures to protect candidate records against unauthorized access, destruction, or disclosure.
`.trim();

export const PLATFORM_DATA_AGREEMENT_PREVIEW = `
INTERVUE EMPLOYER SERVICE & DATA EXCHANGE AGREEMENT

1. Nature of Platform Services
InterVue operates an AI-assisted IT recruitment and applicant tracking platform connecting verified employers with technical talent.

2. Lawful Data Handling
Both InterVue and the Employer agree to uphold enterprise-grade privacy safeguards, ensuring that personal identifying information exchanged via the service complies with national cybersecurity and privacy legislation.

3. Termination and Revocation
Should employer credentials, business verification, or authorization be revoked, access to active candidate pipelines and publishing privileges will cease immediately to prevent unauthorized data dissemination.
`.trim();
