'use client';

import CatEmptyIllustration from '@/components/connect/CatEmptyIllustration';
import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import ConnectSidebar from '@/components/recruiter/connect/ConnectSidebar';
import ConnectThread from '@/components/recruiter/connect/ConnectThread';
import EligibleCandidatesPanel from '@/components/recruiter/connect/EligibleCandidatesPanel';
import Spinner from '@/components/common/Spinner';
import { useConnectStream } from '@/hooks/useConnectStream';
import { useConnectInvalidation, useConversations, useRulesAck } from '@/hooks/useRecruiterConnect';
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
    return <ConnectRulesModal mode="gate" portal="recruiter" onClose={() => {}} />;
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col bg-slate-50 p-2 sm:p-3">
      {/* Top Banner Tagline (TopCV style) */}
      <div className="mb-2 hidden items-center justify-center py-1 text-center md:flex">
        <p className="text-xs font-semibold text-slate-800">
          New way to follow your chance. <span className="font-bold text-[#00b14f]">More engage, more success</span>
        </p>
      </div>

      {/* Main 3-column Window */}
      <div className="border-outline-variant flex flex-1 overflow-hidden rounded-2xl border bg-white shadow-xs">
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
          <div className="flex flex-1 flex-col items-center justify-center bg-slate-50/40 p-6">
            <CatEmptyIllustration
              title="You don't have any conversations..."
              description="Select an applicant on the right to start a conversation."
            />
          </div>
        )}

        <EligibleCandidatesPanel />

        {isRulesViewOpen && (
          <ConnectRulesModal mode="view" portal="recruiter" onClose={() => setRulesViewOpen(false)} />
        )}
      </div>
    </div>
  );
}
