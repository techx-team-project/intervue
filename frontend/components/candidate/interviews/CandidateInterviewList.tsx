'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { INTERVIEW_PAGE_SIZE } from '@/constants/interview';
import { useCandidateInterviews } from '@/hooks/useInterviews';
import type { Interview } from '@/types/interview';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import CandidateInterviewCard from './CandidateInterviewCard';

function groupInterviews(items: Interview[], now: number) {
  const upcoming = (item: Interview) => new Date(item.startsAt).getTime() > now;
  const needsReply = items.filter((item) => item.status === 'PROPOSED' && upcoming(item));
  const comingUp = items.filter(
    (item) => (item.status === 'CONFIRMED' || item.status === 'RESCHEDULE_REQUESTED') && upcoming(item),
  );
  const finished = items.filter((item) => !needsReply.includes(item) && !comingUp.includes(item));
  return [
    { title: 'Needs your response', items: needsReply },
    { title: 'Upcoming', items: comingUp.toSorted((a, b) => a.startsAt.localeCompare(b.startsAt)) },
    { title: 'Past or closed', items: finished },
  ].filter((group) => group.items.length > 0);
}

export default function CandidateInterviewList() {
  const [page, setPage] = useState(0);
  const [openedAt] = useState(() => Date.now());
  const { data, isLoading, isError, error, refetch } = useCandidateInterviews(page, INTERVIEW_PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8">
      <header>
        <h1 className="text-2xl font-black text-slate-900">Interview schedule</h1>
        <p className="mt-1 text-sm text-slate-500">
          Confirm attendance, propose another time if you are busy and add interviews to your calendar.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          {groupInterviews(data.items, openedAt).map((group) => (
            <section key={group.title} className="space-y-3">
              <h2 className="text-sm font-bold text-slate-700">
                {group.title} <span className="font-medium text-slate-400">({group.items.length})</span>
              </h2>
              {group.items.map((interview) => (
                <CandidateInterviewCard key={interview.id} interview={interview} />
              ))}
            </section>
          ))}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
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
          <p className="text-sm font-semibold text-slate-700">You have no interview invitations yet</p>
          <p className="mt-1 text-xs text-slate-500">
            When a recruiter invites you, the schedule will appear here and be sent by email.
          </p>
        </div>
      )}
    </div>
  );
}
