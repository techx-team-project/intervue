'use client';

import ConnectEmptyPanel from '@/components/connect/ConnectEmptyPanel';
import { useCandidateConversations, useCandidateInvitations } from '@/hooks/useCandidateConnect';

export default function CandidateConnectEmptyCenter() {
  const { conversations } = useCandidateConversations();
  const { invitations } = useCandidateInvitations();

  const emptyTitle =
    invitations.length > 0
      ? 'Select an invitation or conversation'
      : conversations.length > 0
        ? 'Select a conversation to start chatting'
        : 'No conversations yet...';

  return (
    <ConnectEmptyPanel
      title={emptyTitle}
      description="Real-time messaging between candidates and verified recruiters."
    />
  );
}
