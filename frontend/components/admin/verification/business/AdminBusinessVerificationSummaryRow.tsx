'use client';

import type { BusinessVerificationSummaryResource, DocumentReviewStatus } from '@/types/recruiter-company';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, FileText, ShieldAlert } from 'lucide-react';

interface AdminBusinessVerificationSummaryRowProps {
  summary: BusinessVerificationSummaryResource;
  selectedStatus?: DocumentReviewStatus | 'ALL';
  onSelectStatus: (status: DocumentReviewStatus | 'ALL') => void;
}

export function AdminBusinessVerificationSummaryRow({
  summary,
  selectedStatus = 'ALL',
  onSelectStatus,
}: AdminBusinessVerificationSummaryRowProps) {
  const cards = [
    {
      id: 'ALL' as const,
      label: 'All Requests',
      count: summary.total,
      icon: FileText,
      accent: 'text-slate-700 dark:text-forest-200',
      activeRing: 'border-emerald-600 ring-2 ring-emerald-500/20',
    },
    {
      id: 'PENDING_REVIEW' as const,
      label: 'Pending Review',
      count: summary.pendingReview,
      icon: Clock,
      accent: 'text-amber-600 dark:text-amber-400',
      activeRing: 'border-amber-500 ring-2 ring-amber-500/20',
      pulse: summary.pendingReview > 0,
    },
    {
      id: 'MORE_INFO_REQUIRED' as const,
      label: 'Info Requested',
      count: summary.moreInfoRequired,
      icon: AlertTriangle,
      accent: 'text-sky-600 dark:text-sky-400',
      activeRing: 'border-sky-500 ring-2 ring-sky-500/20',
    },
    {
      id: 'APPROVED' as const,
      label: 'Approved',
      count: summary.approved,
      icon: CheckCircle2,
      accent: 'text-emerald-600 dark:text-emerald-400',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/20',
    },
    {
      id: 'REJECTED' as const,
      label: 'Rejected',
      count: summary.rejected,
      icon: AlertCircle,
      accent: 'text-rose-600 dark:text-rose-400',
      activeRing: 'border-rose-500 ring-2 ring-rose-500/20',
    },
    {
      id: 'REVOKED' as const,
      label: 'Revoked / Expired',
      count: summary.revoked + summary.expired,
      icon: ShieldAlert,
      accent: 'text-slate-600 dark:text-forest-300',
      activeRing: 'border-slate-500 ring-2 ring-slate-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`flex flex-col justify-between rounded-2xl border p-3.5 text-left transition ${
              isSelected
                ? `${card.activeRing} dark:bg-forest-900 bg-white shadow-sm`
                : 'dark:border-forest-800 dark:bg-forest-900/60 dark:hover:border-forest-700 border-slate-200 bg-white/70 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="dark:text-forest-300 text-[11px] font-semibold text-slate-500">{card.label}</span>
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

            <div className="dark:text-forest-50 mt-2 text-xl font-extrabold tracking-tight text-slate-900">
              {card.count}
            </div>
          </button>
        );
      })}
    </div>
  );
}
