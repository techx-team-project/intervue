'use client';

import CandidateAppliedJobsPanel from '@/components/candidate/connect/CandidateAppliedJobsPanel';
import CandidateConnectSidebar, {
  type CandidateConnectTab,
} from '@/components/candidate/connect/CandidateConnectSidebar';
import CandidateConnectThread from '@/components/candidate/connect/CandidateConnectThread';
import CatEmptyIllustration from '@/components/connect/CatEmptyIllustration';
import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import Spinner from '@/components/common/Spinner';
import { useConnectStream } from '@/hooks/useConnectStream';
import {
  useCandidateConnectInvalidation,
  useCandidateConversations,
  useCandidateInvitations,
  useCandidateRulesAck,
} from '@/hooks/useCandidateConnect';
import { useCallback, useState } from 'react';

export default function CandidateConnectView() {
  const { data: rulesAck, isLoading: isRulesLoading } = useCandidateRulesAck();
  const [isRulesViewOpen, setRulesViewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<CandidateConnectTab>('ALL');

  const {
    conversations,
    isLoading: isLoadingConversations,
    hasMore: hasMoreConversations,
    isLoadingMore: isLoadingMoreConversations,
    loadMore: loadMoreConversations,
  } = useCandidateConversations();

  const { invitations, isLoading: isLoadingInvitations } = useCandidateInvitations();

  const invalidate = useCandidateConnectInvalidation();
  const onStreamMessage = useCallback(() => invalidate(selectedId ?? undefined), [invalidate, selectedId]);
  useConnectStream('candidate', onStreamMessage, rulesAck?.acknowledged === true);

  const selectedConversation =
    selectedTab === 'INVITATIONS'
      ? (invitations.find((invitation) => invitation.id === selectedId) ?? null)
      : (conversations.find((conversation) => conversation.id === selectedId) ?? null);

  const handleInvitationAccepted = (connectionId: number) => {
    setSelectedTab('ALL');
    setSelectedId(connectionId);
  };

  const handleInvitationDeclined = () => {
    setSelectedId(null);
  };

  if (isRulesLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (!rulesAck?.acknowledged) {
    return <ConnectRulesModal mode="gate" portal="candidate" onClose={() => {}} />;
  }

  const emptyTitle =
    selectedTab === 'INVITATIONS'
      ? invitations.length > 0
        ? 'Select an invitation to view recruiter message'
        : 'No invitations yet...'
      : conversations.length > 0
        ? 'Select a conversation to start chatting'
        : 'No conversations yet...';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <CandidateConnectSidebar
        conversations={conversations}
        invitations={invitations}
        isLoadingConversations={isLoadingConversations}
        isLoadingInvitations={isLoadingInvitations}
        hasMoreConversations={hasMoreConversations}
        isLoadingMoreConversations={isLoadingMoreConversations}
        onLoadMoreConversations={loadMoreConversations}
        selectedId={selectedId}
        selectedTab={selectedTab}
        onSelectTab={(tab) => {
          setSelectedTab(tab);
          setSelectedId(null);
        }}
        onSelectConversation={setSelectedId}
        onOpenRules={() => setRulesViewOpen(true)}
      />

      {selectedConversation ? (
        <CandidateConnectThread
          conversation={selectedConversation}
          onAccepted={handleInvitationAccepted}
          onDeclined={handleInvitationDeclined}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <div className="hidden min-w-0 flex-1 flex-col bg-white md:flex">
          <div className="border-outline-variant flex h-14 shrink-0 items-center border-b px-5">
            <p className="text-xs font-semibold text-slate-800 sm:text-[13px]">
              New way to follow your chance. <span className="font-bold text-[#00b14f]">More engage, more success</span>
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center bg-white p-6">
            <CatEmptyIllustration
              title={emptyTitle}
              description="Real-time messaging between candidates and verified recruiters."
            />
          </div>
        </div>
      )}

      <CandidateAppliedJobsPanel selectedCompanyId={selectedConversation?.companyId} />

      {isRulesViewOpen && <ConnectRulesModal mode="view" portal="candidate" onClose={() => setRulesViewOpen(false)} />}
    </div>
  );
}
