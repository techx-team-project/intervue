'use client';

import InterviewStatusBadge from '@/components/interview/InterviewStatusBadge';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { INTERVIEW_FILTER_TABS, INTERVIEW_FORMAT_LABELS, INTERVIEW_PAGE_SIZE } from '@/constants/interview';
import { ROUTES } from '@/constants/routes';
import { useRecruiterInterviews } from '@/hooks/useInterviews';
import { cn } from '@/lib/utils';
import type { InterviewStatus } from '@/types/interview';
import { formatInterviewMoment } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RecruiterInterviewsView() {
  const [status, setStatus] = useState<InterviewStatus | undefined>();
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = useRecruiterInterviews(page, INTERVIEW_PAGE_SIZE, status);

  const select = (value: InterviewStatus | undefined) => {
    setStatus(value);
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {INTERVIEW_FILTER_TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={status === tab.value}
            onClick={() => select(tab.value)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              status === tab.value
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <ul className="space-y-2.5">
            {data.items.map((interview) => (
              <li key={interview.id}>
                <Link
                  href={`${ROUTES.RECRUITER_APPLICATIONS}/${interview.applicationId}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-colors hover:border-slate-300"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-bold text-slate-900">{interview.candidateName}</p>
                    <p className="truncate text-xs text-slate-500">{interview.jobTitle}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CalendarClock className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                      {formatInterviewMoment(interview.startsAt)} · {INTERVIEW_FORMAT_LABELS[interview.format]}
                    </p>
                  </div>
                  <InterviewStatusBadge status={interview.status} />
                </Link>
              </li>
            ))}
          </ul>
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Trước
              </Button>
              <span className="text-xs text-slate-500">
                Trang {page + 1} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page + 1 >= data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">Chưa có lịch phỏng vấn nào</p>
          <p className="mt-1 text-xs text-slate-500">Mở một hồ sơ ứng tuyển và bấm “Mời phỏng vấn” để đặt lịch.</p>
        </div>
      )}
    </div>
  );
}
