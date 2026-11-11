'use client';

import InviteCandidateModal from '@/components/recruiter/connect/InviteCandidateModal';
import Spinner from '@/components/common/Spinner';
import { Input } from '@/components/ui/Input';
import UserAvatar from '@/components/ui/UserAvatar';
import { ROUTES } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useEligibleCandidates } from '@/hooks/useRecruiterConnect';
import { cn } from '@/lib/utils';
import type { EligibleCandidate } from '@/types/connect';
import { formatRelativeDay } from '@/utils/datetime';
import { MessageSquarePlus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type EligibleCandidatesPanelProps = {
  variant?: 'sidebar' | 'modal';
  onInvited?: () => void;
};

export default function EligibleCandidatesPanel({ variant = 'sidebar', onInvited }: EligibleCandidatesPanelProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { candidates, isLoading } = useEligibleCandidates(debouncedSearch);
  const [inviteTarget, setInviteTarget] = useState<EligibleCandidate | null>(null);

  const isModal = variant === 'modal';

  return (
    <div
      className={cn(
        'flex flex-col bg-white',
        isModal
          ? 'h-[65vh] w-full'
          : 'border-outline-variant hidden h-full shrink-0 border-l lg:flex lg:w-[356px] xl:w-[388px] 2xl:w-[404px]',
      )}
    >
      {!isModal ? (
        <div className="shrink-0">
          <div className="flex h-14 items-center px-4">
            <p className="text-xs font-bold tracking-wide text-slate-800 uppercase">Other Candidates</p>
          </div>
          <div className="border-outline-variant border-b px-4 pt-1 pb-3">
            <Input
              radius="full"
              focusTone="neutral"
              placeholder="Search candidate..."
              leftIcon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9.5 bg-slate-50/70 text-[13px]"
            />
            <p className="mt-1.5 px-1 text-[11px] text-slate-400">Applicants who applied to your job postings</p>
          </div>
        </div>
      ) : (
        <div className="border-outline-variant border-b pb-3">
          <Input
            radius="full"
            focusTone="neutral"
            placeholder="Search candidate..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9.5 bg-slate-50/70 text-[13px]"
          />
        </div>
      )}

      <div className={cn('flex-1 overflow-y-auto py-2', isModal ? '' : 'px-2')}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : candidates.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant px-2.5 py-6 text-center">No eligible candidates found.</p>
        ) : (
          <div className="space-y-1">
            {candidates.map((candidate) => (
              <div
                key={candidate.candidateId}
                className="hover:bg-surface-container-low flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors"
              >
                <UserAvatar fullName={candidate.fullName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm text-on-surface truncate font-semibold">{candidate.fullName}</p>
                  <p className="text-label-sm text-on-surface-variant truncate">
                    {candidate.jobTitle || candidate.email}
                  </p>
                  {candidate.submittedAt && (
                    <p className="text-[11px] text-slate-400">
                      Applied {formatRelativeDay(candidate.submittedAt).toLowerCase()}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setInviteTarget(candidate)}
                  title="Message"
                  aria-label={`Message ${candidate.fullName}`}
                  className="text-primary hover:bg-primary-light flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={cn('border-outline-variant border-t', isModal ? 'pt-3' : 'p-3')}>
        <Link
          href={ROUTES.RECRUITER_APPLICATIONS}
          className="flex h-10.5 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          Manage applications
        </Link>
      </div>

      {inviteTarget && (
        <InviteCandidateModal
          prefilledCandidate={inviteTarget}
          onClose={() => {
            setInviteTarget(null);
            onInvited?.();
          }}
        />
      )}
    </div>
  );
}
