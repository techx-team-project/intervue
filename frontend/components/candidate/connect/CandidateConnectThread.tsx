'use client';

import CandidateBlockConversationDialog from '@/components/candidate/connect/CandidateBlockConversationDialog';
import CandidateConnectComposer from '@/components/candidate/connect/CandidateConnectComposer';
import CandidateReportConversationModal from '@/components/candidate/connect/CandidateReportConversationModal';
import ConversationActionsMenu from '@/components/recruiter/connect/ConversationActionsMenu';
import ConnectMessageBubble from '@/components/recruiter/connect/ConnectMessageBubble';
import Spinner from '@/components/common/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import UserAvatar from '@/components/ui/UserAvatar';
import { useInView } from '@/hooks/useInView';
import {
  candidateConnectKeys,
  useAcceptInvitation,
  useCandidateMessages,
  useDeclineInvitation,
} from '@/hooks/useCandidateConnect';
import type { ConversationSummary } from '@/types/connect';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type CandidateConnectThreadProps = {
  conversation: ConversationSummary;
  onAccepted?: (connectionId: number) => void;
  onDeclined?: () => void;
  onBack?: () => void;
};

export default function CandidateConnectThread({
  conversation,
  onAccepted,
  onDeclined,
  onBack,
}: CandidateConnectThreadProps) {
  const queryClient = useQueryClient();
  const { messages, isLoading, hasOlder, isLoadingOlder, loadOlder } = useCandidateMessages(conversation.id);
  const { ref: topSentinelRef, inView: topInView } = useInView<HTMLDivElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();

  const isPending = conversation.status === 'PENDING';
  const isBlocked = conversation.status === 'BLOCKED';
  const canSend = conversation.status === 'ACCEPTED';

  // Instant unread badge clear on selection
  useEffect(() => {
    if (conversation.unreadCount > 0) {
      queryClient.setQueryData(candidateConnectKeys.conversations, (old: unknown) => {
        if (!old || typeof old !== 'object' || !('pages' in old)) return old;
        const infiniteData = old as { pages: Array<{ items: ConversationSummary[] }> };
        return {
          ...infiniteData,
          pages: infiniteData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.id === conversation.id ? { ...item, unreadCount: 0 } : item)),
          })),
        };
      });
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.unread });
    }
  }, [conversation.id, conversation.unreadCount, queryClient]);

  const chronological = useMemo(() => [...messages].reverse(), [messages]);
  const newestMessageId = chronological.at(-1)?.id;
  const loadingOlderRef = useRef(false);

  useEffect(() => {
    if (topInView && hasOlder && !isLoadingOlder) {
      loadingOlderRef.current = true;
      loadOlder();
    }
  }, [topInView, hasOlder, isLoadingOlder, loadOlder]);

  useEffect(() => {
    if (loadingOlderRef.current) {
      loadingOlderRef.current = false;
      return;
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [conversation.id, newestMessageId]);

  const handleAccept = () => {
    acceptInvitation.mutate(conversation.id, {
      onSuccess: () => {
        toast.success('You have accepted the chat invitation!');
        onAccepted?.(conversation.id);
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const handleDecline = () => {
    declineInvitation.mutate(conversation.id, {
      onSuccess: () => {
        toast.success('You have declined the chat invitation.');
        onDeclined?.();
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Thread Header */}
      <div className="border-outline-variant flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-white px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface -ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:hidden"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
          )}
          <UserAvatar fullName={conversation.companyName} size="md" />
          <div className="min-w-0">
            <p className="text-body-lg text-on-surface truncate font-bold">{conversation.companyName}</p>
            <p className="text-label-sm text-on-surface-variant truncate">
              {isPending ? 'Invitation received' : 'Connected company'}
            </p>
          </div>
          {isPending && <Badge variant="warning">Pending invitation</Badge>}
          {isBlocked && <Badge variant="danger">Blocked</Badge>}
        </div>

        <ConversationActionsMenu
          onBlock={() => setBlockDialogOpen(true)}
          onReport={() => setReportModalOpen(true)}
          blocked={isBlocked}
        />
      </div>

      {/* Thread Content */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {isPending && (
          <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">Chat invitation from {conversation.companyName}</p>
                <p className="mt-0.5 text-xs text-slate-500">Received on {formatDateTime(conversation.invitedAt)}</p>
                {conversation.lastMessagePreview && (
                  <div className="mt-3 rounded-xl border border-emerald-100 bg-white p-3.5 text-sm text-slate-700">
                    <p className="leading-relaxed font-normal whitespace-pre-wrap">
                      &quot;{conversation.lastMessagePreview}&quot;
                    </p>
                  </div>
                )}
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    onClick={handleAccept}
                    isLoading={acceptInvitation.isPending}
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept invitation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    isLoading={declineInvitation.isPending}
                    className="flex items-center gap-1.5 text-slate-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasOlder && <div ref={topSentinelRef} />}
        {isLoadingOlder && (
          <div className="flex justify-center py-2">
            <Spinner />
          </div>
        )}

        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          chronological.map((message) => (
            <ConnectMessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderType === 'CANDIDATE'}
              portal="candidate"
            />
          ))
        )}
      </div>

      {/* Composer */}
      <CandidateConnectComposer
        connectionId={conversation.id}
        disabled={!canSend}
        disabledReason={
          isPending
            ? 'Please accept the invitation above to start messaging.'
            : isBlocked
              ? 'This conversation has been blocked.'
              : 'You have declined this chat invitation.'
        }
      />

      {isBlockDialogOpen && (
        <CandidateBlockConversationDialog connectionId={conversation.id} onClose={() => setBlockDialogOpen(false)} />
      )}
      {isReportModalOpen && (
        <CandidateReportConversationModal connectionId={conversation.id} onClose={() => setReportModalOpen(false)} />
      )}
    </div>
  );
}
