'use client';

import { recruiterConnectApi } from '@/apiRequest/recruiter-connect';
import ConnectThreadFrame from '@/components/connect/ConnectThreadFrame';
import BlockConversationDialog from '@/components/recruiter/connect/BlockConversationDialog';
import ReportConversationModal from '@/components/recruiter/connect/ReportConversationModal';
import {
  useConversationMessages,
  useEditMessage,
  useMarkConversationRead,
  useReactMessage,
  useSendAttachment,
  useSendMessage,
  useSendTyping,
  useUnblockConversation,
  useUnsendMessage,
} from '@/hooks/useRecruiterConnect';
import { useAuthStore } from '@/store/auth.store';
import type { ConversationSummary } from '@/types/connect';
import { triggerConnectBlobDownload } from '@/utils/connect-chat';
import { useCallback } from 'react';

type ConnectThreadProps = {
  conversation: ConversationSummary;
  onBack?: () => void;
};

export default function ConnectThread({ conversation, onBack }: ConnectThreadProps) {
  const currentUserId = useAuthStore((s) => s.recruiter.user?.id ?? 0);
  const { messages, isLoading, hasOlder, loadOlder, isLoadingOlder } = useConversationMessages(conversation.id);
  const sendMessage = useSendMessage(conversation.id);
  const sendAttachment = useSendAttachment(conversation.id);
  const editMessage = useEditMessage(conversation.id);
  const unsendMessage = useUnsendMessage(conversation.id);
  const reactMessage = useReactMessage(conversation.id);
  const { mutate: markReadMutate } = useMarkConversationRead(conversation.id);
  const { mutate: sendTypingMutate } = useSendTyping(conversation.id);
  const unblock = useUnblockConversation(conversation.id);

  const handleMarkRead = useCallback(
    (lastReadMessageId?: number) => {
      markReadMutate(lastReadMessageId);
    },
    [markReadMutate],
  );

  const handleTypingChange = useCallback(
    (typing: boolean) => {
      sendTypingMutate(typing);
    },
    [sendTypingMutate],
  );

  return (
    <ConnectThreadFrame
      key={conversation.id}
      portal="recruiter"
      conversation={conversation}
      currentUserId={currentUserId}
      messages={messages}
      isLoading={isLoading}
      hasOlder={Boolean(hasOlder)}
      isLoadingOlder={isLoadingOlder}
      onLoadOlder={loadOlder}
      isComposerPending={sendMessage.isPending || sendAttachment.isPending || editMessage.isPending}
      isUnblocking={unblock.isPending}
      onSendText={(payload) => sendMessage.mutateAsync(payload)}
      onSendAttachment={(payload) => sendAttachment.mutateAsync(payload)}
      onEditMessage={(messageId, payload) => editMessage.mutateAsync({ messageId, payload })}
      onUnsendMessage={(messageId, scope) => unsendMessage.mutateAsync({ messageId, scope })}
      onReactMessage={(messageId, emoji) => reactMessage.mutateAsync({ messageId, emoji })}
      onMarkRead={handleMarkRead}
      onTypingChange={handleTypingChange}
      onUnblock={() => unblock.mutateAsync()}
      onDownloadAttachment={async (msg) => {
        const blob = await recruiterConnectApi.downloadAttachment(conversation.id, msg.id);
        triggerConnectBlobDownload(blob, msg.attachmentFileName ?? 'attachment');
      }}
      onFetchLinkPreview={(url) => recruiterConnectApi.linkPreview(url)}
      onBack={onBack}
      renderBlockModal={(onClose) => <BlockConversationDialog connectionId={conversation.id} onClose={onClose} />}
      renderReportModal={(onClose) => <ReportConversationModal connectionId={conversation.id} onClose={onClose} />}
    />
  );
}
