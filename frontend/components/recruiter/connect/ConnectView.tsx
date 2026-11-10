'use client';

import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import ConnectSidebar from '@/components/recruiter/connect/ConnectSidebar';
import ConnectThread from '@/components/recruiter/connect/ConnectThread';
import EligibleCandidatesPanel from '@/components/recruiter/connect/EligibleCandidatesPanel';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import { useConnectStream } from '@/hooks/useConnectStream';
import { useConnectInvalidation, useConversations, useRulesAck } from '@/hooks/useRecruiterConnect';
import { MessageSquare } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function ConnectView() {
  const { data: rulesAck, isLoading: isRulesLoading } = useRulesAck();
  const [isRulesViewOpen, setRulesViewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { conversations, isLoading, hasMore, isLoadingMore, loadMore } = useConversations();
  const invalidate = useConnectInvalidation();
  const onStreamMessage = useCallback(() => invalidate(selectedId ?? undefined), [invalidate, selectedId]);
  useConnectStream('recruiter', onStreamMessage, rulesAck?.acknowledged === true);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? null;

  if (isRulesLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!rulesAck?.acknowledged) {
    return <ConnectRulesModal mode="gate" onClose={() => {}} />;
  }

  return (
    <div className="border-outline-variant flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border bg-white">
      <ConnectSidebar
        conversations={conversations}
        isLoading={isLoading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onOpenRules={() => setRulesViewOpen(true)}
      />

      {selectedConversation ? (
        <ConnectThread conversation={selectedConversation} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState icon={MessageSquare} title="Chọn một cuộc trò chuyện để bắt đầu" className="border-none" />
        </div>
      )}

      <EligibleCandidatesPanel />

      {isRulesViewOpen && <ConnectRulesModal mode="view" onClose={() => setRulesViewOpen(false)} />}
    </div>
  );
}
