'use client';

import type { BusinessVerificationSummaryResource, DocumentReviewStatus } from '@/types/recruiter-company';
import { AlertTriangle, Calendar, Clock, FileText, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ExtendedSummaryResource extends BusinessVerificationSummaryResource {
  slaOverdueCount?: number;
  expiringSoonCount?: number;
}

interface AdminBusinessVerificationSummaryRowProps {
  summary: ExtendedSummaryResource;
  selectedStatus?: DocumentReviewStatus | 'ALL' | 'EXPIRING_SOON' | 'SLA_OVERDUE';
  onSelectStatus: (status: DocumentReviewStatus | 'ALL' | 'EXPIRING_SOON' | 'SLA_OVERDUE') => void;
}

export function AdminBusinessVerificationSummaryRow({
  summary,
  selectedStatus = 'ALL',
  onSelectStatus,
}: AdminBusinessVerificationSummaryRowProps) {
  const slaOverdue = summary.slaOverdueCount ?? 0;
  const expiringSoon = summary.expiringSoonCount ?? 0;

  const kpis = [
    {
      id: 'ALL' as const,
      title: 'All Requests',
      count: summary.total,
      subtext: 'Total submissions',
      icon: FileText,
      accent: 'text-slate-600 dark:text-forest-200',
      activeRing: 'border-emerald-600 ring-2 ring-emerald-500/15 bg-white shadow-xs dark:bg-forest-900',
    },
    {
      id: 'PENDING_REVIEW' as const,
      title: 'Pending Review',
      count: summary.pendingReview,
      subtext: slaOverdue > 0 ? `${slaOverdue} overdue (>24h)` : 'Within target SLA',
      subtextAlert: slaOverdue > 0,
      icon: Clock,
      accent: 'text-amber-600 dark:text-amber-400',
      activeRing: 'border-amber-500 ring-2 ring-amber-500/15 bg-white shadow-xs dark:bg-forest-900',
      pulse: summary.pendingReview > 0,
    },
    {
      id: 'MORE_INFO_REQUIRED' as const,
      title: 'Needs Action',
      count: summary.moreInfoRequired,
      subtext: 'Awaiting recruiter response',
      icon: AlertTriangle,
      accent: 'text-sky-600 dark:text-sky-400',
      activeRing: 'border-sky-500 ring-2 ring-sky-500/15 bg-white shadow-xs dark:bg-forest-900',
    },
    {
      id: 'APPROVED' as const,
      title: 'Approved',
      count: summary.approved,
      subtext: 'Active publishing rights',
      icon: ShieldCheck,
      accent: 'text-emerald-600 dark:text-emerald-400',
      activeRing: 'border-emerald-600 ring-2 ring-emerald-500/15 bg-white shadow-xs dark:bg-forest-900',
    },
    {
      id: 'EXPIRING_SOON' as const,
      title: 'Expiring LOA',
      count: expiringSoon,
      subtext: 'Renewal required (<30d)',
      subtextAlert: expiringSoon > 0,
      icon: Calendar,
      accent: 'text-orange-600 dark:text-orange-400',
      activeRing: 'border-orange-500 ring-2 ring-orange-500/15 bg-white shadow-xs dark:bg-forest-900',
      pulse: expiringSoon > 0,
    },
    {
      id: 'REJECTED' as const,
      title: 'Rejected / Revoked',
      count: summary.rejected + summary.revoked,
      subtext: 'Ineligible / Suspended',
      icon: ShieldAlert,
      accent: 'text-rose-600 dark:text-rose-400',
      activeRing: 'border-rose-500 ring-2 ring-rose-500/15 bg-white shadow-xs dark:bg-forest-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
              isSelected
                ? `${card.activeRing} shadow-sm`
                : 'dark:border-forest-800 dark:bg-forest-900/60 dark:hover:border-forest-700 border-slate-200/90 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="dark:text-forest-300 text-xs font-semibold text-slate-600">{card.title}</span>
              <div className="relative">
                <Icon className={`h-4 w-4 ${card.accent}`} />
                {card.pulse && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3">
              <div className="dark:text-forest-50 text-2xl font-bold tracking-tight text-slate-900">{card.count}</div>
              <p
                className={`mt-1 text-[11px] leading-tight ${
                  card.subtextAlert
                    ? 'font-medium text-amber-600 dark:text-amber-400'
                    : 'dark:text-forest-400 text-slate-400'
                }`}
              >
                {card.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
