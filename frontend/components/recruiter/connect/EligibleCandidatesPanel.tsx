'use client';

import InviteCandidateModal from '@/components/recruiter/connect/InviteCandidateModal';
import Spinner from '@/components/common/Spinner';
import UserAvatar from '@/components/ui/UserAvatar';
import { useEligibleCandidates } from '@/hooks/useRecruiterConnect';
import type { EligibleCandidate } from '@/types/connect';
import { MessageSquarePlus } from 'lucide-react';
import { useState } from 'react';

export default function EligibleCandidatesPanel() {
  const { candidates, isLoading } = useEligibleCandidates('');
  const [inviteTarget, setInviteTarget] = useState<EligibleCandidate | null>(null);

  return (
    <div className="border-outline-variant hidden h-full w-72 shrink-0 flex-col border-l bg-white lg:flex">
      <div className="border-outline-variant border-b px-4 py-3.5">
        <p className="text-label-md text-on-surface-variant font-bold tracking-wide uppercase">Ứng viên khác</p>
        <p className="text-label-sm text-on-surface-variant mt-1">
          Đã ứng tuyển vào công ty bạn, chưa có cuộc trò chuyện
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : candidates.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant px-2.5 py-4 text-center">Chưa có ứng viên nào phù hợp.</p>
        ) : (
          <div className="space-y-1">
            {candidates.map((candidate) => (
              <div
                key={candidate.candidateId}
                className="hover:bg-surface-container-low flex items-center gap-2.5 rounded-xl px-2.5 py-2"
              >
                <UserAvatar fullName={candidate.fullName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm text-on-surface truncate font-semibold">{candidate.fullName}</p>
                  <p className="text-label-sm text-on-surface-variant truncate">{candidate.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteTarget(candidate)}
                  title="Nhắn tin"
                  aria-label={`Nhắn tin cho ${candidate.fullName}`}
                  className="text-primary hover:bg-primary-light flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {inviteTarget && <InviteCandidateModal prefilledCandidate={inviteTarget} onClose={() => setInviteTarget(null)} />}
    </div>
  );
}
