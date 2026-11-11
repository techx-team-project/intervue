'use client';

import Spinner from '@/components/common/Spinner';
import ConnectEmptyPanel from '@/components/connect/ConnectEmptyPanel';
import ConnectThread from '@/components/recruiter/connect/ConnectThread';
import { ROUTES } from '@/constants/routes';
import { useConversations, useRecruiterConversation } from '@/hooks/useRecruiterConnect';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type ConnectThreadSlotProps = {
  connectionId: number | null;
};

export default function ConnectThreadSlot({ connectionId }: ConnectThreadSlotProps) {
  const router = useRouter();
  const { conversations } = useConversations();
  const { data: fetchedConversation, isLoading, isError } = useRecruiterConversation(connectionId);

  const conversation = useMemo(() => {
    if (!connectionId) return null;
    return conversations.find((item) => item.id === connectionId) ?? fetchedConversation ?? null;
  }, [connectionId, conversations, fetchedConversation]);

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
            href={ROUTES.RECRUITER_MESSAGES}
            className="text-primary border-outline-variant inline-flex h-9 items-center rounded-lg border bg-white px-4 text-xs font-semibold hover:bg-slate-50"
          >
            Back to conversations
          </Link>
        }
      />
    );
  }

  return <ConnectThread conversation={conversation} onBack={() => router.push(ROUTES.RECRUITER_MESSAGES)} />;
}
