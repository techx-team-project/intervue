'use client';

import ConnectEmptyPanel from '@/components/connect/ConnectEmptyPanel';
import { ConnectThreadSkeleton } from '@/components/connect/ConnectSkeletons';
import ConnectThread from '@/components/recruiter/connect/ConnectThread';
import { ROUTES } from '@/constants/routes';
import { useConversations, useRecruiterConversationByKey } from '@/hooks/useRecruiterConnect';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type ConnectThreadSlotProps = {
  routeKey: string | null;
};

export default function ConnectThreadSlot({ routeKey }: ConnectThreadSlotProps) {
  const router = useRouter();
  const { conversations } = useConversations();
  const { data: fetchedConversation, isLoading, isError } = useRecruiterConversationByKey(routeKey);

  const conversation = useMemo(() => {
    if (!routeKey) return null;
    return conversations.find((item) => item.publicId === routeKey) ?? fetchedConversation ?? null;
  }, [routeKey, conversations, fetchedConversation]);

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
