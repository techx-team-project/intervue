'use client';

import ConnectThreadProgressBar from '@/components/connect/ConnectThreadProgressBar';
import ConnectWorkspaceBootLoader from '@/components/connect/ConnectWorkspaceBootLoader';
import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import ConnectSidebar from '@/components/recruiter/connect/ConnectSidebar';
import EligibleCandidatesPanel from '@/components/recruiter/connect/EligibleCandidatesPanel';
import Modal from '@/components/ui/Modal';
import { recruiterConversationUrl } from '@/constants/routes';
import { useConversations, useRecruiterConversationByKey, useRulesAck } from '@/hooks/useRecruiterConnect';
import { cn } from '@/lib/utils';
import { useConnectUiStore } from '@/store/connect-ui.store';
import { parseConnectRouteKey } from '@/utils/connect-chat';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';

type ConnectViewProps = {
  children: ReactNode;
};

export default function ConnectView({ children }: ConnectViewProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const selectedKey = parseConnectRouteKey(params?.id);

  const [showRules, setShowRules] = useState(false);
  const mobileEligibleOpen = useConnectUiStore((s) => s.mobileEligibleOpen);
  const setMobileEligibleOpen = useConnectUiStore((s) => s.setMobileEligibleOpen);
  const rightPanelOpen = useConnectUiStore((s) => s.rightPanelOpen);

  const { data: rulesAck, isLoading: isLoadingRules } = useRulesAck();
  const { conversations, isLoading, hasMore, isLoadingMore, loadMore } = useConversations();
  const { data: singleConversation } = useRecruiterConversationByKey(selectedKey);

  const selectedConversation = useMemo(() => {
    if (selectedKey === null) return null;
    return conversations.find((c) => c.publicId === selectedKey) ?? singleConversation ?? null;
  }, [selectedKey, conversations, singleConversation]);

  const isBootReady = !isLoadingRules && !isLoading;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ConnectWorkspaceBootLoader isDataReady={isBootReady} />
      <ConnectThreadProgressBar
        portal="recruiter"
        connectionId={selectedConversation?.id ?? null}
        connectionKey={selectedKey}
      />

      <ConnectSidebar
        conversations={conversations}
        isLoading={isLoading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        selectedKey={selectedKey}
        onSelect={(publicId) => router.push(recruiterConversationUrl(publicId))}
        onOpenRules={() => setShowRules(true)}
        onOpenEligible={() => setMobileEligibleOpen(true)}
      />

      <main className={cn('min-w-0 flex-1 flex-col bg-white', selectedKey === null ? 'hidden md:flex' : 'flex')}>
        {children}
      </main>

      {rightPanelOpen && (
        <EligibleCandidatesPanel
          onInvited={(createdId) => {
            if (createdId) {
              router.push(recruiterConversationUrl(createdId));
            }
          }}
        />
      )}

      <Modal
        isOpen={mobileEligibleOpen}
        onClose={() => setMobileEligibleOpen(false)}
        maxWidth="md"
        radius="md"
        title="Other Candidates"
      >
        <EligibleCandidatesPanel
          variant="modal"
          onInvited={(createdId) => {
            setMobileEligibleOpen(false);
            if (createdId) {
              router.push(recruiterConversationUrl(createdId));
            }
          }}
        />
      </Modal>

      {rulesAck && !rulesAck.acknowledged && <ConnectRulesModal mode="gate" portal="recruiter" onClose={() => {}} />}
      {showRules && <ConnectRulesModal mode="view" portal="recruiter" onClose={() => setShowRules(false)} />}
    </div>
  );
}
