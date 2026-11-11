'use client';

import CandidateAppliedJobsPanel from '@/components/candidate/connect/CandidateAppliedJobsPanel';
import CandidateConnectSidebar from '@/components/candidate/connect/CandidateConnectSidebar';
import ConnectThreadProgressBar from '@/components/connect/ConnectThreadProgressBar';
import ConnectWorkspaceBootLoader from '@/components/connect/ConnectWorkspaceBootLoader';
import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import { candidateConversationUrl } from '@/constants/routes';
import {
  useCandidateConversationByKey,
  useCandidateConversations,
  useCandidateInvitations,
  useCandidateRulesAck,
} from '@/hooks/useCandidateConnect';
import { cn } from '@/lib/utils';
import { useConnectUiStore } from '@/store/connect-ui.store';
import { parseConnectRouteKey } from '@/utils/connect-chat';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type CandidateConnectViewProps = {
  children: ReactNode;
};

export default function CandidateConnectView({ children }: CandidateConnectViewProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const selectedKey = parseConnectRouteKey(params?.id);

  const selectedTab = useConnectUiStore((s) => s.candidateTab);
  const setSelectedTab = useConnectUiStore((s) => s.setCandidateTab);
  const rightPanelOpen = useConnectUiStore((s) => s.rightPanelOpen);
  const lastAutoSyncedKeyRef = useRef<string | null>(null);
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
  const { data: singleConversation } = useCandidateConversationByKey(selectedKey);

  const selectedConversation = useMemo(() => {
    if (selectedKey === null) return null;
    return (
      conversations.find((c) => c.publicId === selectedKey) ??
      invitations.find((i) => i.publicId === selectedKey) ??
      singleConversation ??
      null
    );
  }, [selectedKey, conversations, invitations, singleConversation]);

  // Auto-focus the Invitations tab once when opening a pending request directly (e.g. via deep-link/reload).
  useEffect(() => {
    if (selectedKey === null || !selectedConversation) return;
    if (lastAutoSyncedKeyRef.current === selectedKey) return;
    if (selectedConversation.status === 'PENDING') {
      useConnectUiStore.getState().setCandidateTab('INVITATIONS');
    }
    lastAutoSyncedKeyRef.current = selectedKey;
  }, [selectedKey, selectedConversation]);

  const isBootReady = !isLoadingRules && !isLoadingConversations && !isLoadingInvitations;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ConnectWorkspaceBootLoader isDataReady={isBootReady} />
      <ConnectThreadProgressBar
        portal="candidate"
        connectionId={selectedConversation?.id ?? null}
        connectionKey={selectedKey}
      />

      <CandidateConnectSidebar
        conversations={conversations}
        invitations={invitations}
        isLoadingConversations={isLoadingConversations}
        isLoadingInvitations={isLoadingInvitations}
        hasMoreConversations={hasMoreConversations}
        isLoadingMoreConversations={isLoadingMoreConversations}
        onLoadMoreConversations={loadMoreConversations}
        selectedKey={selectedKey}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        onSelectConversation={(publicId) => router.push(candidateConversationUrl(publicId))}
        onOpenRules={() => setShowRules(true)}
      />

      <main className={cn('min-w-0 flex-1 flex-col bg-white', selectedKey === null ? 'hidden md:flex' : 'flex')}>
        {children}
      </main>

      {rightPanelOpen && <CandidateAppliedJobsPanel selectedCompanyId={selectedConversation?.companyId} />}

      {rulesAck && !rulesAck.acknowledged && <ConnectRulesModal mode="gate" portal="candidate" onClose={() => {}} />}
      {showRules && <ConnectRulesModal mode="view" portal="candidate" onClose={() => setShowRules(false)} />}
    </div>
  );
}
