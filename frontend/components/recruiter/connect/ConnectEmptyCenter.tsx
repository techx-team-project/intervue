'use client';

import ConnectEmptyPanel from '@/components/connect/ConnectEmptyPanel';
import { useConversations } from '@/hooks/useRecruiterConnect';

export default function ConnectEmptyCenter() {
  const { conversations } = useConversations();

  return (
    <ConnectEmptyPanel
      title={conversations.length > 0 ? 'Select a conversation to start chatting' : 'No conversations yet...'}
      description="Select an applicant on the right to start a conversation."
    />
  );
}
