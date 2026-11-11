'use client';

import ConnectRightPanelToggle from '@/components/connect/ConnectRightPanelToggle';
import ConversationActionsMenu from '@/components/recruiter/connect/ConversationActionsMenu';
import UserAvatar from '@/components/ui/UserAvatar';
import type { ConnectPortal, ConversationSummary } from '@/types/connect';
import { ArrowLeft } from 'lucide-react';

type ConnectThreadHeaderProps = {
  conversation: ConversationSummary;
  portal?: ConnectPortal;
  onBlock: () => void;
  onUnblock?: () => void;
  isUnblocking?: boolean;
  onReport: () => void;
  onBack?: () => void;
};

export default function ConnectThreadHeader({
  conversation,
  portal = 'recruiter',
  onBlock,
  onUnblock,
  isUnblocking = false,
  onReport,
  onBack,
}: ConnectThreadHeaderProps) {
  const displayName = portal === 'recruiter' ? conversation.candidateName : conversation.companyName;
  const viewerActorType = portal === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';
  const canUnblock = conversation.status === 'BLOCKED' && conversation.blockedByActorType === viewerActorType;

  return (
    <div className="border-outline-variant flex h-[68px] shrink-0 items-center justify-between gap-3 border-b bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface -ml-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full md:hidden"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
        )}
        <UserAvatar fullName={displayName} size="md" />
        <div className="min-w-0">
          <p className="text-on-surface truncate text-[15px] leading-tight font-bold sm:text-base">{displayName}</p>
          <p className="mt-0.5 truncate text-[13px] text-slate-500">
            {conversation.status === 'PENDING' && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {portal === 'recruiter'
                  ? `${conversation.companyName} · Awaiting candidate response`
                  : 'Invitation pending your response'}
              </span>
            )}
            {conversation.status === 'BLOCKED' && <span className="text-rose-600">Conversation blocked</span>}
            {conversation.status === 'DECLINED' && <span className="text-rose-600">Invitation declined</span>}
            {conversation.status === 'ACCEPTED' &&
              (portal === 'recruiter' ? conversation.companyName : 'Connected company')}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <ConversationActionsMenu
          onBlock={onBlock}
          onUnblock={onUnblock}
          isUnblocking={isUnblocking}
          onReport={onReport}
          blocked={conversation.status === 'BLOCKED'}
          canUnblock={canUnblock}
        />
        <ConnectRightPanelToggle />
      </div>
    </div>
  );
}
