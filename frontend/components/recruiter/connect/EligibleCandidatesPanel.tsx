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
        isModal ? 'h-[65vh] w-full' : 'border-outline-variant hidden h-full w-80 shrink-0 border-l lg:flex',
      )}
    >
      <div className={cn('border-outline-variant border-b', isModal ? 'pb-3' : 'px-4 py-3.5')}>
        {!isModal && (
          <>
            <p className="text-label-md text-on-surface-variant font-bold tracking-wide uppercase">Other Candidates</p>
            <p className="text-label-sm text-on-surface-variant mt-0.5">Applicants who applied to your job postings</p>
          </>
        )}
        <div className={isModal ? '' : 'mt-2.5'}>
          <Input
            placeholder="Search candidate..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

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
          className="border-outline-variant text-on-surface hover:bg-surface-container-low flex w-full items-center justify-center rounded-xl border py-2.5 text-xs font-semibold transition-colors"
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
