'use client';

import CatEmptyIllustration from '@/components/connect/CatEmptyIllustration';
import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import ConnectSidebar from '@/components/recruiter/connect/ConnectSidebar';
import ConnectThread from '@/components/recruiter/connect/ConnectThread';
import EligibleCandidatesPanel from '@/components/recruiter/connect/EligibleCandidatesPanel';
import Spinner from '@/components/common/Spinner';
import Modal from '@/components/ui/Modal';
import { useConnectStream } from '@/hooks/useConnectStream';
import { useConnectInvalidation, useConversations, useRulesAck } from '@/hooks/useRecruiterConnect';
import { useCallback, useState } from 'react';

export default function ConnectView() {
  const { data: rulesAck, isLoading: isRulesLoading } = useRulesAck();
  const [isRulesViewOpen, setRulesViewOpen] = useState(false);
  const [isEligibleModalOpen, setEligibleModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { conversations, isLoading, hasMore, isLoadingMore, loadMore } = useConversations();
  const invalidate = useConnectInvalidation();
  const onStreamMessage = useCallback(() => invalidate(selectedId ?? undefined), [invalidate, selectedId]);
  useConnectStream('recruiter', onStreamMessage, rulesAck?.acknowledged === true);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? null;

  if (isRulesLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (!rulesAck?.acknowledged) {
    return <ConnectRulesModal mode="gate" portal="recruiter" onClose={() => {}} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <ConnectSidebar
        conversations={conversations}
        isLoading={isLoading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onOpenRules={() => setRulesViewOpen(true)}
        onOpenEligible={() => setEligibleModalOpen(true)}
      />

      {selectedConversation ? (
        <ConnectThread conversation={selectedConversation} onBack={() => setSelectedId(null)} />
      ) : (
        <div className="hidden min-w-0 flex-1 flex-col bg-white md:flex">
          <div className="border-outline-variant flex h-14 shrink-0 items-center border-b px-5">
            <p className="text-xs font-semibold text-slate-800 sm:text-[13px]">
              New way to follow your chance. <span className="font-bold text-[#00b14f]">More engage, more success</span>
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center bg-white p-6">
            <CatEmptyIllustration
              title={conversations.length > 0 ? 'Select a conversation to start chatting' : 'No conversations yet...'}
              description="Select an applicant on the right to start a conversation."
            />
          </div>
        </div>
      )}

      <EligibleCandidatesPanel />

      {isRulesViewOpen && <ConnectRulesModal mode="view" portal="recruiter" onClose={() => setRulesViewOpen(false)} />}

      <Modal
        isOpen={isEligibleModalOpen}
        onClose={() => setEligibleModalOpen(false)}
        title="Other Candidates"
        description="Applied to your job postings recently"
      >
        <EligibleCandidatesPanel variant="modal" onInvited={() => setEligibleModalOpen(false)} />
      </Modal>
    </div>
  );
}
