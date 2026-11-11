'use client';

import Spinner from '@/components/common/Spinner';
import CandidateConnectThread from '@/components/candidate/connect/CandidateConnectThread';
import ConnectEmptyPanel from '@/components/connect/ConnectEmptyPanel';
import { ROUTES } from '@/constants/routes';
import {
  useCandidateConversation,
  useCandidateConversations,
  useCandidateInvitations,
} from '@/hooks/useCandidateConnect';
import { useConnectUiStore } from '@/store/connect-ui.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type CandidateConnectThreadSlotProps = {
  connectionId: number | null;
};

export default function CandidateConnectThreadSlot({ connectionId }: CandidateConnectThreadSlotProps) {
  const router = useRouter();
  const setCandidateTab = useConnectUiStore((s) => s.setCandidateTab);
  const { conversations } = useCandidateConversations();
  const { invitations } = useCandidateInvitations();
  const { data: fetchedConversation, isLoading, isError } = useCandidateConversation(connectionId);

  const conversation = useMemo(() => {
    if (!connectionId) return null;
    return (
      conversations.find((item) => item.id === connectionId) ??
      invitations.find((item) => item.id === connectionId) ??
      fetchedConversation ??
      null
    );
  }, [connectionId, conversations, invitations, fetchedConversation]);

  if (connectionId && isLoading && !conversation) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (!connectionId || !conversation || (isError && !conversation)) {
    return (
      <ConnectEmptyPanel
        title="Conversation not found"
        description="This conversation may have been removed or you do not have access to it."
        action={
          <Link
            href={ROUTES.CANDIDATE_CONVERSATIONS}
            className="text-primary border-outline-variant inline-flex h-9 items-center rounded-lg border bg-white px-4 text-xs font-semibold hover:bg-slate-50"
          >
            Back to conversations
          </Link>
        }
      />
    );
  }

  return (
    <CandidateConnectThread
      conversation={conversation}
      onBack={() => router.push(ROUTES.CANDIDATE_CONVERSATIONS)}
      onAcceptedInvitation={() => setCandidateTab('ALL')}
    />
  );
}
