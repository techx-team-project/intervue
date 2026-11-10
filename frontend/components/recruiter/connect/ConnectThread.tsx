'use client';

import ConnectComposer from '@/components/recruiter/connect/ConnectComposer';
import ConnectMessageBubble from '@/components/recruiter/connect/ConnectMessageBubble';
import ConnectThreadHeader from '@/components/recruiter/connect/ConnectThreadHeader';
import ReportConversationModal from '@/components/recruiter/connect/ReportConversationModal';
import BlockConversationDialog from '@/components/recruiter/connect/BlockConversationDialog';
import Spinner from '@/components/common/Spinner';
import { useInView } from '@/hooks/useInView';
import { useConversationMessages } from '@/hooks/useRecruiterConnect';
import type { ConversationSummary } from '@/types/connect';
import { useEffect, useMemo, useRef, useState } from 'react';

type ConnectThreadProps = {
  conversation: ConversationSummary;
};

export default function ConnectThread({ conversation }: ConnectThreadProps) {
  const { messages, isLoading, hasOlder, isLoadingOlder, loadOlder } = useConversationMessages(conversation.id);
  const { ref: topSentinelRef, inView: topInView } = useInView<HTMLDivElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

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

  const canSend = conversation.status === 'ACCEPTED';

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <ConnectThreadHeader
        conversation={conversation}
        onBlock={() => setBlockDialogOpen(true)}
        onReport={() => setReportModalOpen(true)}
      />

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
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
            <ConnectMessageBubble key={message.id} message={message} isOwn={message.senderType === 'RECRUITER'} />
          ))
        )}
      </div>

      <ConnectComposer
        connectionId={conversation.id}
        disabled={!canSend}
        disabledReason={
          conversation.status === 'PENDING'
            ? 'Đang chờ ứng viên chấp nhận lời mời trò chuyện.'
            : conversation.status === 'BLOCKED'
              ? 'Cuộc trò chuyện này đã bị chặn.'
              : 'Ứng viên đã từ chối lời mời trò chuyện.'
        }
      />

      {isBlockDialogOpen && (
        <BlockConversationDialog connectionId={conversation.id} onClose={() => setBlockDialogOpen(false)} />
      )}
      {isReportModalOpen && (
        <ReportConversationModal connectionId={conversation.id} onClose={() => setReportModalOpen(false)} />
      )}
    </div>
  );
}
