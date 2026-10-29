// TEMP: replace with API
import { ROUTES } from '@/constants/routes';
import type {
  AdminBannerSlide,
  AdminDashboardData,
  AdminHighlight,
  AdminQueueCounts,
  AdminQueueSummary,
  AdminWorkItem,
} from '@/types/admin';

const BANNERS: AdminBannerSlide[] = [
  {
    id: 'banner-bot',
    eyebrow: 'InterVue Bot AI',
    title: 'Keep the assistant answering correctly',
    description: 'Review the guide documents and FAQ that the help chatbot reads before it replies to users.',
    ctaLabel: 'Meet the mascot',
    href: '/mascot',
    imageSrc: '/admin/banner-bot.jpg',
    imageAlt: 'InterVue Bot AI mascot assistant with hologram',
    gradientClassName: 'bg-linear-to-r from-[#06241a] via-[#07291d] to-[#011c13]',
  },
  {
    id: 'banner-trust',
    eyebrow: 'Trust & safety',
    title: '34 candidates are waiting on identity review',
    description: 'FPT.AI could not auto-decide these submissions. Candidates cannot apply until you review them.',
    ctaLabel: 'Review eKYC queue',
    href: `${ROUTES.ADMIN_DASHBOARD}?queue=identityVerification`,
    imageSrc: '/admin/banner-ekyc.jpg',
    imageAlt: 'Biometric eKYC identity verification with security shield',
    gradientClassName: 'bg-linear-to-r from-[#072418] via-[#082a1c] to-[#002e1e]',
  },
  {
    id: 'banner-business',
    eyebrow: 'Business verification',
    title: 'Unverified companies cannot publish',
    description: 'Approve licences and authorisation letters so recruiters can start posting jobs.',
    ctaLabel: 'Review companies',
    href: `${ROUTES.ADMIN_DASHBOARD}?queue=businessVerification`,
    imageSrc: '/admin/banner-company.jpg',
    imageAlt: 'Corporate enterprise license verification certificate',
    gradientClassName: 'bg-linear-to-r from-[#0a1e36] via-[#0b274c] to-[#0f2f58]',
  },
  {
    id: 'banner-moderation',
    eyebrow: 'Moderation',
    title: 'Eight job posts need a decision',
    description: 'Approved posts appear in search immediately. Rejected posts return to the recruiter with a reason.',
    ctaLabel: 'Review job posts',
    href: `${ROUTES.ADMIN_DASHBOARD}?queue=jobPost`,
    imageSrc: '/admin/banner-moderation.jpg',
    imageAlt: 'Job post moderation with inspection glass and approval stamp',
    gradientClassName: 'bg-linear-to-r from-[#291806] via-[#341e09] to-[#3a220a]',
  },
];

const HIGHLIGHTS: AdminHighlight[] = [
  { key: 'waiting', label: 'Waiting for a decision', value: '75', caption: 'across 8 queues', tone: 'amber' },
  {
    key: 'oldest',
    label: 'Oldest in queue',
    value: '1 day',
    caption: 'Report #4812 · FPT Software',
    tone: 'violet',
  },
  { key: 'resolved', label: 'Resolved today', value: '18', caption: 'by 4 admins', tone: 'primary' },
  { key: 'autoApproved', label: 'eKYC auto-approved', value: '86%', caption: 'scored at or above 80%', tone: 'sky' },
];

const QUEUES: AdminQueueSummary[] = [
  {
    key: 'identityVerification',
    label: 'Identity verification',
    href: ROUTES.ADMIN_VERIFICATION_IDENTITY,
    count: 34,
  },
  {
    key: 'businessVerification',
    label: 'Business verification',
    href: ROUTES.ADMIN_VERIFICATION_BUSINESS,
    count: 12,
  },
  { key: 'companyChanges', label: 'Company info changes', href: ROUTES.ADMIN_VERIFICATION_COMPANY_CHANGES, count: 2 },
  { key: 'jobPosts', label: 'Job posts', href: ROUTES.ADMIN_MODERATION_JOBS, count: 8 },
  { key: 'reports', label: 'Reports', href: ROUTES.ADMIN_MODERATION_REPORTS, count: 5 },
  { key: 'supportTickets', label: 'Support tickets', href: ROUTES.ADMIN_SUPPORT_TICKETS, count: 7 },
  { key: 'consultationRequests', label: 'Consultation requests', href: ROUTES.ADMIN_SUPPORT_CONSULTATIONS, count: 3 },
  { key: 'unmatchedTransactions', label: 'Unmatched transactions', href: ROUTES.ADMIN_FINANCE_TRANSACTIONS, count: 4 },
  { key: 'vatInvoices', label: 'VAT invoice requests', href: ROUTES.ADMIN_FINANCE_VAT_INVOICES, count: 0 },
];

const WORK_ITEMS: AdminWorkItem[] = [
  {
    id: 'ekyc-8821',
    kind: 'identityVerification',
    subject: 'Trần Ngọc Anh',
    context: 'Face match scored in the manual-review band',
    waitingLabel: '2 hours',
    submittedAt: '28 Oct 2026, 07:40',
    facts: [
      { label: 'ID card read', value: '94%' },
      { label: 'Face match', value: '72% — needs a decision' },
      { label: 'Liveness', value: '88%' },
      { label: 'Date of birth', value: '14 Mar 2003 · age 23' },
      { label: 'Attempt', value: '1 of 5' },
    ],
  },
  {
    id: 'biz-4471',
    kind: 'businessVerification',
    subject: 'TechX Global JSC',
    context: 'Business licence submitted, authorisation letter missing',
    waitingLabel: '5 hours',
    submittedAt: '28 Oct 2026, 04:15',
    facts: [
      { label: 'Tax code', value: '0101234567' },
      { label: 'Licence file', value: 'TechX_GPKD_2026.pdf · 1.8 MB' },
      { label: 'Authorisation letter', value: 'Not submitted' },
      { label: 'Submitted by', value: 'Nguyễn Minh Phúc · recruiter' },
      { label: 'Company members', value: '3 recruiters' },
    ],
  },
  {
    id: 'job-9120',
    kind: 'jobPost',
    subject: 'Senior Flutter Developer · VNG',
    context: 'Salary range contradicts the description',
    waitingLabel: '9 hours',
    submittedAt: '28 Oct 2026, 00:32',
    facts: [
      { label: 'Salary field', value: 'VND 25M – 35M / month' },
      { label: 'Description says', value: '“up to 60 triệu cho ứng viên xuất sắc”' },
      { label: 'Contract', value: 'Full-time · Hybrid · Hanoi' },
      { label: 'Company', value: 'VNG Corporation · verified' },
    ],
  },
  {
    id: 'report-4812',
    kind: 'report',
    subject: 'Report #4812 · FPT Software',
    context: 'Candidate reported the post as asking for money',
    waitingLabel: '1 day',
    submittedAt: '27 Oct 2026, 09:05',
    facts: [
      { label: 'Reason', value: 'Asks candidates to pay a deposit' },
      { label: 'Reported by', value: 'ngocanh.tran@gmail.com' },
      { label: 'Evidence', value: '2 screenshots attached' },
      { label: 'Reports on this company', value: '1 in the last 90 days' },
    ],
  },
  {
    id: 'ticket-2290',
    kind: 'supportTicket',
    subject: 'Lê Hoàng Nam',
    context: 'Manual eKYC review requested after 5 rejected attempts',
    waitingLabel: '1 day',
    submittedAt: '27 Oct 2026, 08:12',
    facts: [
      { label: 'Attempts used', value: '5 of 5' },
      { label: 'Last rejection', value: 'ID card photo too blurred' },
      { label: 'ID numbers used', value: '1 — no mismatch' },
      { label: 'Email verified', value: 'Yes' },
    ],
  },
  {
    id: 'change-0311',
    kind: 'companyChange',
    subject: 'Sao Bắc Đẩu Technology',
    context: 'Requested a change to the registered company name',
    waitingLabel: '4 hours',
    submittedAt: '28 Oct 2026, 05:20',
    facts: [
      { label: 'Current name', value: 'Sao Bac Dau Technology JSC' },
      { label: 'Requested name', value: 'SBD Technology Group JSC' },
      { label: 'Supporting document', value: 'Updated licence · 2.1 MB' },
      { label: 'Verified since', value: '12 Aug 2026' },
    ],
  },
];

const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  banners: BANNERS,
  highlights: HIGHLIGHTS,
  queues: QUEUES,
  workItems: WORK_ITEMS,
  metrics: [
    { key: 'candidates', label: 'New candidates', value: '1,204' },
    { key: 'liveJobPosts', label: 'Live job posts', value: '742' },
    { key: 'verifiedCompanies', label: 'Verified companies', value: '318' },
    { key: 'applications', label: 'Applications', value: '2,914' },
    { key: 'paidOrders', label: 'Paid orders', value: '247' },
  ],
  recentAudit: [
    {
      id: 'audit-001',
      actorName: 'Phạm Hoàng Tuấn',
      actorRoleLabel: 'Super admin',
      action: 'Approved business licence',
      targetLabel: 'FPT Software',
      outcome: 'approved',
      at: '09:42',
    },
    {
      id: 'audit-002',
      actorName: 'Lê Minh Châu',
      actorRoleLabel: 'Moderator',
      action: 'Rejected job post',
      targetLabel: 'Backend Engineer · Tiki',
      outcome: 'rejected',
      reason: 'Required skills copied from an unrelated post',
      at: '09:17',
    },
    {
      id: 'audit-003',
      actorName: 'Trần Quốc Bảo',
      actorRoleLabel: 'Moderator',
      action: 'Locked account',
      targetLabel: 'hieunt.fake@gmail.com',
      outcome: 'locked',
      reason: 'Three confirmed reports of a fraudulent job post',
      at: '08:55',
    },
    {
      id: 'audit-004',
      actorName: 'Lê Minh Châu',
      actorRoleLabel: 'Moderator',
      action: 'Dismissed report',
      targetLabel: 'Report #4799 · Shopee',
      outcome: 'dismissed',
      reason: 'Reported content matches the published post',
      at: '08:30',
    },
    {
      id: 'audit-005',
      actorName: 'Phạm Hoàng Tuấn',
      actorRoleLabel: 'Super admin',
      action: 'Granted extra eKYC attempts',
      targetLabel: 'ngocanh.tran@gmail.com',
      outcome: 'updated',
      reason: 'Blurred photos caused by a device camera fault',
      at: '08:04',
    },
    {
      id: 'audit-006',
      actorName: 'Đỗ Thu Hà',
      actorRoleLabel: 'Finance',
      action: 'Matched SePay transaction',
      targetLabel: 'Order #INV-20261028-0031',
      outcome: 'updated',
      at: '07:48',
    },
  ],
};

export function getAdminQueueCounts(): AdminQueueCounts {
  return QUEUES.reduce<AdminQueueCounts>((counts, queue) => {
    counts[queue.key] = queue.count;
    return counts;
  }, {});
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return MOCK_ADMIN_DASHBOARD;
}
