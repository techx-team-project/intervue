import type { AdminHighlightKey, AdminQueueKey, AdminWorkItemKind } from '@/types/admin';
import { BadgeCheck, Bot, CheckCheck, Clock3, FileText, Flag, Inbox, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const HIGHLIGHT_ICON: Record<AdminHighlightKey, LucideIcon> = {
  waiting: Inbox,
  oldest: Clock3,
  resolved: CheckCheck,
  autoApproved: Bot,
};

export interface AdminQuickLink {
  queue: AdminQueueKey;
  kind: AdminWorkItemKind;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_QUICK_LINKS: AdminQuickLink[] = [
  { queue: 'identityVerification', kind: 'identityVerification', label: 'eKYC', icon: BadgeCheck },
  { queue: 'businessVerification', kind: 'businessVerification', label: 'Business', icon: ShieldCheck },
  { queue: 'jobPosts', kind: 'jobPost', label: 'Job posts', icon: FileText },
  { queue: 'reports', kind: 'report', label: 'Reports', icon: Flag },
];

export const WORK_ITEM_KIND_LABEL: Record<AdminWorkItemKind, string> = {
  identityVerification: 'eKYC',
  businessVerification: 'Business',
  companyChange: 'Company',
  jobPost: 'Job post',
  report: 'Report',
  supportTicket: 'Support',
};

export const WORK_ITEM_KIND_CHIP: Record<AdminWorkItemKind, string> = {
  identityVerification: 'bg-violet-50 text-violet-700 ring-violet-200',
  businessVerification: 'bg-blue-50 text-blue-700 ring-blue-200',
  companyChange: 'bg-sky-50 text-sky-700 ring-sky-200',
  jobPost: 'bg-amber-50 text-amber-700 ring-amber-200',
  report: 'bg-rose-50 text-rose-700 ring-rose-200',
  supportTicket: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export const QUEUE_BAR_COLOR: Record<AdminQueueKey, string> = {
  identityVerification: 'bg-violet-500',
  businessVerification: 'bg-blue-500',
  companyChanges: 'bg-sky-500',
  jobPosts: 'bg-amber-500',
  reports: 'bg-rose-500',
  supportTickets: 'bg-slate-400',
  consultationRequests: 'bg-teal-500',
  unmatchedTransactions: 'bg-indigo-500',
  vatInvoices: 'bg-emerald-500',
};

export const REJECTION_REASON_PRESETS: Record<AdminWorkItemKind, string[]> = {
  identityVerification: [
    'ID card photo is blurred or cropped',
    'Face does not match the ID card photo',
    'Liveness check could not be confirmed',
    'ID card appears altered',
  ],
  businessVerification: [
    'Business licence is unreadable',
    'Authorisation letter is missing',
    'Tax code does not match the licence',
    'Company name differs from the licence',
  ],
  companyChange: [
    'No supporting document for the change',
    'Requested name does not match the licence',
    'Change would make the profile misleading',
  ],
  jobPost: [
    'Salary contradicts the description',
    'Requirements copied from an unrelated post',
    'Asks candidates to pay money',
    'Description is not a real vacancy',
  ],
  report: [
    'Reported content matches the published post',
    'Not enough evidence to act',
    'Already handled in an earlier report',
  ],
  supportTicket: [
    'Identity could not be confirmed',
    'Request is outside platform support',
    'Suspected fraudulent attempt',
  ],
};
