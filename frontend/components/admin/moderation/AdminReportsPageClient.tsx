'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAdminReports } from '@/hooks/useAdminModeration';
import { cn } from '@/lib/utils';
import type { AdminReportSummary, ReportReasonCode, ReportStatus, ReportTargetType } from '@/types/admin-moderation';
import { formatDateTime } from '@/utils/datetime';
import { Eye, Flag, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import AdminFilterWordsTab from './AdminFilterWordsTab';
import AdminReportReviewModal from './AdminReportReviewModal';

const PAGE_SIZE = 15;

const REASON_LABELS: Record<ReportReasonCode, string> = {
  SCAM: 'Scam / Fraud',
  HARASSMENT: 'Harassment',
  SPAM: 'Spam / Ads',
  INAPPROPRIATE: 'Inappropriate',
  OTHER: 'Other',
};

const STATUS_TABS: Array<{ value: ReportStatus | undefined; label: string }> = [
  { value: undefined, label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTION_TAKEN', label: 'Action Taken' },
  { value: 'DISMISSED', label: 'Dismissed' },
];

export default function AdminReportsPageClient() {
  const [mainTab, setMainTab] = useState<'REPORTS' | 'FILTER_WORDS'>('REPORTS');
  const [status, setStatus] = useState<ReportStatus | undefined>(undefined);
  const [targetType, setTargetType] = useState<ReportTargetType | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<AdminReportSummary | null>(null);

  const { data: pageData, isLoading } = useAdminReports({
    status,
    targetType,
    page: page - 1,
    size: PAGE_SIZE,
  });

  const reports = pageData?.items ?? [];
  const totalItems = pageData?.totalItems ?? 0;
  const pageCount = pageData?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <AdminPageHeader
        description="Review reported conversations, take punitive or safety actions, and configure screening patterns."
        count={mainTab === 'REPORTS' ? totalItems : undefined}
        countLabel={mainTab === 'REPORTS' ? 'reports' : undefined}
      />

      {/* Main Tabs Navigation */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMainTab('REPORTS');
            setPage(1);
          }}
          className={cn(
            'flex cursor-pointer items-center gap-2 border-b-2 py-3 text-xs font-bold transition-colors',
            mainTab === 'REPORTS'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800',
          )}
        >
          <Flag className="h-4 w-4" />
          <span>Reports Queue</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMainTab('FILTER_WORDS');
          }}
          className={cn(
            'flex cursor-pointer items-center gap-2 border-b-2 py-3 text-xs font-bold transition-colors',
            mainTab === 'FILTER_WORDS'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800',
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Automated Filter Rules</span>
        </button>
      </div>

      {mainTab === 'FILTER_WORDS' ? (
        <AdminFilterWordsTab />
      ) : (
        <div className="space-y-4">
          {/* Sub Filters for Reports */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setStatus(tab.value);
                    setPage(1);
                  }}
                  className={cn(
                    'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    status === tab.value
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Target:</span>
              <select
                value={targetType ?? ''}
                onChange={(e) => {
                  setTargetType(e.target.value ? (e.target.value as ReportTargetType) : undefined);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value="">All Targets</option>
                <option value="CONVERSATION">Conversation</option>
                <option value="JOB_POST">Job Post</option>
                <option value="CANDIDATE">Candidate</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : reports.length === 0 ? (
              <div className="py-12 text-center">
                <Flag className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-600">No reports in this queue</p>
                <p className="text-xs text-slate-400">Everything looks clean and safe.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Report ID</th>
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Reported By</th>
                      <th className="px-4 py-3">Violation Reason</th>
                      <th className="px-4 py-3">Report Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.map((report) => (
                      <tr key={report.id} className="transition-colors hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">#{report.id}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {report.targetType} #{report.targetId}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <span className="font-semibold text-slate-800">{report.reporterType}</span> #
                          {report.reporterId}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                            {REASON_LABELS[report.reasonCode] ?? report.reasonCode}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                          {formatDateTime(report.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              report.status === 'PENDING'
                                ? 'warning'
                                : report.status === 'ACTION_TAKEN'
                                  ? 'danger'
                                  : 'default'
                            }
                          >
                            {report.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedReport(report)}
                            className="flex items-center gap-1.5 text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <Pagination
              page={page}
              pageCount={pageCount}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}

          {/* Detail Review Modal */}
          {selectedReport && (
            <AdminReportReviewModal reportSummary={selectedReport} onClose={() => setSelectedReport(null)} />
          )}
        </div>
      )}
    </div>
  );
}
