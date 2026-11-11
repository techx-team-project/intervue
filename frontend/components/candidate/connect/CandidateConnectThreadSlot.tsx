'use client';

import CandidateConnectThread from '@/components/candidate/connect/CandidateConnectThread';
import ConnectEmptyPanel from '@/components/connect/ConnectEmptyPanel';
import { ConnectThreadSkeleton } from '@/components/connect/ConnectSkeletons';
import { ROUTES } from '@/constants/routes';
import {
  useCandidateConversationByKey,
  useCandidateConversations,
  useCandidateInvitations,
} from '@/hooks/useCandidateConnect';
import { useConnectUiStore } from '@/store/connect-ui.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type CandidateConnectThreadSlotProps = {
  routeKey: string | null;
};

export default function CandidateConnectThreadSlot({ routeKey }: CandidateConnectThreadSlotProps) {
  const router = useRouter();
  const setCandidateTab = useConnectUiStore((s) => s.setCandidateTab);
  const { conversations } = useCandidateConversations();
  const { invitations } = useCandidateInvitations();
  const { data: fetchedConversation, isLoading, isError } = useCandidateConversationByKey(routeKey);

  const conversation = useMemo(() => {
    if (!routeKey) return null;
    return (
      conversations.find((item) => item.publicId === routeKey) ??
      invitations.find((item) => item.publicId === routeKey) ??
      fetchedConversation ??
      null
    );
  }, [routeKey, conversations, invitations, fetchedConversation]);

  if (routeKey && isLoading && !conversation) {
    return <ConnectThreadSkeleton />;
  }

  if (!routeKey || !conversation || (isError && !conversation)) {
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
