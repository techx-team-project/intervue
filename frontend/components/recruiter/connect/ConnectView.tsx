'use client';

import Spinner from '@/components/common/Spinner';
import ConnectRulesModal from '@/components/recruiter/connect/ConnectRulesModal';
import ConnectSidebar from '@/components/recruiter/connect/ConnectSidebar';
import EligibleCandidatesPanel from '@/components/recruiter/connect/EligibleCandidatesPanel';
import Modal from '@/components/ui/Modal';
import { recruiterConversationUrl } from '@/constants/routes';
import { useConversations, useRulesAck } from '@/hooks/useRecruiterConnect';
import { cn } from '@/lib/utils';
import { useConnectUiStore } from '@/store/connect-ui.store';
import { parseConnectRouteId } from '@/utils/connect-chat';
import { useParams, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

type ConnectViewProps = {
  children: ReactNode;
};

export default function ConnectView({ children }: ConnectViewProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const selectedId = parseConnectRouteId(params?.id);

  const [showRules, setShowRules] = useState(false);
  const mobileEligibleOpen = useConnectUiStore((s) => s.mobileEligibleOpen);
  const setMobileEligibleOpen = useConnectUiStore((s) => s.setMobileEligibleOpen);

  const { data: rulesAck, isLoading: isLoadingRules } = useRulesAck();
  const { conversations, isLoading, hasMore, isLoadingMore, loadMore } = useConversations();

  if (isLoadingRules) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ConnectSidebar
        conversations={conversations}
        isLoading={isLoading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        selectedId={selectedId}
        onSelect={(id) => router.push(recruiterConversationUrl(id))}
        onOpenRules={() => setShowRules(true)}
        onOpenEligible={() => setMobileEligibleOpen(true)}
      />

      <main className={cn('min-w-0 flex-1 flex-col bg-white', selectedId === null ? 'hidden md:flex' : 'flex')}>
        {children}
      </main>

      <EligibleCandidatesPanel
        onInvited={(createdId) => {
          if (createdId) {
            router.push(recruiterConversationUrl(createdId));
          }
        }}
      />

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
