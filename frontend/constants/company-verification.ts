export const VERIFICATION_LEVEL_PERKS = [
  {
    level: 1,
    title: 'Level 1: Basic Account',
    description:
      'Email verified. Can explore the platform, configure recruitment needs and prepare draft job listings.',
    badges: ['Account exploration', 'Draft jobs (up to 3)'],
    restrictions: ['Cannot publish jobs to public board', 'Cannot receive candidate applications'],
    isCurrent: false,
  },
  {
    level: 2,
    title: 'Level 2: Standard Employer',
    description:
      'Phone verified + Data processing agreements accepted. Unlocks publishing jobs and receiving candidate CVs.',
    badges: ['Publish up to 10 active jobs', 'Review & contact applicants', 'Basic AI match insights'],
    restrictions: ['Pending full enterprise trust badge'],
    isCurrent: true,
  },
  {
    level: 3,
    title: 'Level 3: Verified Enterprise',
    description:
      'Official Business License approved by Admin. Unlocks full trust badge, priority recommendations & unlimited recruitment.',
    badges: [
      'Official Verified Employer green badge',
      'Priority candidate recommendation ranking',
      'Unlimited job postings',
      'Direct chat with top candidates',
    ],
    restrictions: [],
    isCurrent: false,
  },
] as const;

export const VERIFICATION_STEPS_META = [
  {
    id: 'phone' as const,
    order: 1,
    title: 'Verify phone number',
    description: 'Secure your recruiter account with phone number OTP authentication.',
    badgeLabel: 'Identity verification',
    actionLabel: 'Verify phone',
  },
  {
    id: 'company' as const,
    order: 2,
    title: 'Update company profile',
    description: 'Link your registered business details, tax ID, and official office address.',
    badgeLabel: 'Business profile',
    actionLabel: 'Update profile',
  },
  {
    id: 'license' as const,
    order: 3,
    title: 'Submit Business License or Authorization',
    description: 'Upload valid Enterprise Registration Certificate (ERC) or Letter of Authorization.',
    badgeLabel: 'Legal compliance',
    actionLabel: 'Upload document',
  },
  {
    id: 'candidate_agreement' as const,
    order: 4,
    title: 'Candidate Data Processing Agreement',
    description: 'Commit to lawful processing of candidate CVs and personal information under Decree 13/2023/ND-CP.',
    badgeLabel: 'Data privacy',
    actionLabel: 'Review agreement',
  },
  {
    id: 'platform_agreement' as const,
    order: 5,
    title: 'InterVue Platform Data Agreement',
    description: 'Consent to data exchange and recruitment platform terms with InterVue.',
    badgeLabel: 'Platform terms',
    actionLabel: 'Agree & continue',
  },
] as const;

export const STANDARD_CANDIDATE_AGREEMENT_PREVIEW = `
INTERVUE DATA PROCESSING AGREEMENT WITH CANDIDATES
(Pursuant to Decree No. 13/2023/ND-CP on Personal Data Protection)

1. Purpose of Processing
The Employer commits to collecting, storing, and processing candidate personal data (including Curriculum Vitae, contact details, work history, education, and screening responses) solely for the legitimate purpose of recruitment and evaluation for positions posted on the InterVue platform.

2. Scope and Retention
- Candidate data shall be retained strictly during the active recruitment cycle and subsequent retention period required by labor laws.
- Data shall not be transferred, disclosed, or commercialized to any unauthorized third parties without explicit consent.

3. Candidate Rights
Candidates retain the right to be informed, review, request rectification, or request erasure of their submitted application data in accordance with statutory privacy provisions.

4. Confidentiality and Security
The Employer implements rigorous technical and organizational security measures to protect candidate records against unauthorized access, destruction, or disclosure.
`.trim();

export const PLATFORM_DATA_AGREEMENT_PREVIEW = `
INTERVUE EMPLOYER SERVICE & DATA EXCHANGE AGREEMENT

1. Nature of Platform Services
InterVue operates as an AI-assisted recruitment infrastructure connecting validated tech enterprises with candidate talent. Final hiring decisions rest exclusively with the Employer.

2. Employer Warranties
The Employer represents and warrants that all corporate information, business licenses, job listings, and hiring conditions posted are authentic, lawful, and accurately reflect genuine employment openings.

3. AI Assistance & Transparency
AI tools provided on InterVue (including CV parsing, match scoring, and interview question suggestions) serve as analytical aids. Employers agree to review recommendations with human judgment and avoid automated discriminatory hiring practices.
`.trim();
