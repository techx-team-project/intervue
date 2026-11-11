'use client';

import CandidateAppliedJobsPanel from '@/components/candidate/connect/CandidateAppliedJobsPanel';
import CandidateConnectSidebar from '@/components/candidate/connect/CandidateConnectSidebar';
import Spinner from '@/components/common/Spinner';
import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import { candidateConversationUrl } from '@/constants/routes';
import {
  useCandidateConversation,
  useCandidateConversations,
  useCandidateInvitations,
  useCandidateRulesAck,
} from '@/hooks/useCandidateConnect';
import { cn } from '@/lib/utils';
import { useConnectUiStore } from '@/store/connect-ui.store';
import { parseConnectRouteId } from '@/utils/connect-chat';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type CandidateConnectViewProps = {
  children: ReactNode;
};

export default function CandidateConnectView({ children }: CandidateConnectViewProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const selectedId = parseConnectRouteId(params?.id);

  const selectedTab = useConnectUiStore((s) => s.candidateTab);
  const setSelectedTab = useConnectUiStore((s) => s.setCandidateTab);
  const rightPanelOpen = useConnectUiStore((s) => s.rightPanelOpen);
  const lastAutoSyncedIdRef = useRef<number | null>(null);
  const [showRules, setShowRules] = useState(false);

  const { data: rulesAck, isLoading: isLoadingRules } = useCandidateRulesAck();
  const {
    conversations,
    isLoading: isLoadingConversations,
    hasMore: hasMoreConversations,
    isLoadingMore: isLoadingMoreConversations,
    loadMore: loadMoreConversations,
  } = useCandidateConversations();
  const { invitations, isLoading: isLoadingInvitations } = useCandidateInvitations();
  const { data: singleConversation } = useCandidateConversation(selectedId);

  const selectedConversation = useMemo(() => {
    if (selectedId === null) return null;
    return (
      conversations.find((c) => c.id === selectedId) ??
      invitations.find((i) => i.id === selectedId) ??
      singleConversation ??
      null
    );
  }, [selectedId, conversations, invitations, singleConversation]);

  // Auto-focus the Invitations tab once when opening a pending request directly (e.g. via deep-link/reload).
  useEffect(() => {
    if (selectedId === null || !selectedConversation) return;
    if (lastAutoSyncedIdRef.current === selectedId) return;
    if (selectedConversation.status === 'PENDING') {
      useConnectUiStore.getState().setCandidateTab('INVITATIONS');
    }
    lastAutoSyncedIdRef.current = selectedId;
  }, [selectedId, selectedConversation]);

  if (isLoadingRules) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
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
        onSelectTab={setSelectedTab}
        onSelectConversation={(id) => router.push(candidateConversationUrl(id))}
        onOpenRules={() => setShowRules(true)}
      />

      <main className={cn('min-w-0 flex-1 flex-col bg-white', selectedId === null ? 'hidden md:flex' : 'flex')}>
        {children}
      </main>

      {rightPanelOpen && <CandidateAppliedJobsPanel selectedCompanyId={selectedConversation?.companyId} />}

      {rulesAck && !rulesAck.acknowledged && <ConnectRulesModal mode="gate" portal="candidate" onClose={() => {}} />}
      {showRules && <ConnectRulesModal mode="view" portal="candidate" onClose={() => setShowRules(false)} />}
    </div>
  );
}
