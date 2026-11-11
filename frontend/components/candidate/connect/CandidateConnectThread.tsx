'use client';

import { candidateConnectApi } from '@/apiRequest/candidate-connect';
import CandidateBlockConversationDialog from '@/components/candidate/connect/CandidateBlockConversationDialog';
import CandidateReportConversationModal from '@/components/candidate/connect/CandidateReportConversationModal';
import DeclineInvitationDialog from '@/components/candidate/connect/DeclineInvitationDialog';
import ConnectThreadFrame from '@/components/connect/ConnectThreadFrame';
import {
  useAcceptInvitation,
  useCandidateEditMessage,
  useCandidateMarkRead,
  useCandidateMessages,
  useCandidateMuteStatus,
  useCandidateReactMessage,
  useCandidateSendAttachment,
  useCandidateSendMessage,
  useCandidateSendTyping,
  useCandidateUnblock,
  useCandidateUnsendMessage,
  useDeclineInvitation,
} from '@/hooks/useCandidateConnect';
import { useAuthStore } from '@/store/auth.store';
import type { ConversationSummary } from '@/types/connect';
import { triggerConnectBlobDownload } from '@/utils/connect-chat';
import { getErrorMessage } from '@/utils/error';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type CandidateConnectThreadProps = {
  conversation: ConversationSummary;
  onBack?: () => void;
  onAcceptedInvitation?: () => void;
};

export default function CandidateConnectThread({
  conversation,
  onBack,
  onAcceptedInvitation,
}: CandidateConnectThreadProps) {
  const currentUserId = useAuthStore((s) => s.candidate.user?.id ?? 0);
  const { data: muteStatus, refetch: refetchMuteStatus } = useCandidateMuteStatus();
  const { messages, isLoading, hasOlder, loadOlder, isLoadingOlder } = useCandidateMessages(conversation.id);
  const sendMessage = useCandidateSendMessage(conversation.id);
  const sendAttachment = useCandidateSendAttachment(conversation.id);
  const editMessage = useCandidateEditMessage(conversation.id);
  const unsendMessage = useCandidateUnsendMessage(conversation.id);
  const reactMessage = useCandidateReactMessage(conversation.id);
  const { mutate: markReadMutate } = useCandidateMarkRead(conversation.id);
  const { mutate: sendTypingMutate } = useCandidateSendTyping(conversation.id);
  const unblock = useCandidateUnblock(conversation.id);
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

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

  const handleMuteExpired = useCallback(() => {
    void refetchMuteStatus();
  }, [refetchMuteStatus]);

  return (
    <>
      <ConnectThreadFrame
        key={conversation.id}
        portal="candidate"
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
          const blob = await candidateConnectApi.downloadAttachment(conversation.id, msg.id);
          triggerConnectBlobDownload(blob, msg.attachmentFileName ?? 'attachment');
        }}
        onFetchLinkPreview={(url) => candidateConnectApi.linkPreview(url)}
        onBack={onBack}
        muteStatus={muteStatus}
        onMuteExpired={handleMuteExpired}
        renderBlockModal={(onClose) => (
          <CandidateBlockConversationDialog connectionId={conversation.id} onClose={onClose} />
        )}
        renderReportModal={(onClose) => (
          <CandidateReportConversationModal connectionId={conversation.id} onClose={onClose} />
        )}
        pendingControls={{
          isAccepting: acceptInvitation.isPending,
          isDeclining: declineInvitation.isPending,
          onAccept: () => {
            acceptInvitation.mutate(conversation.id, {
              onSuccess: () => {
                toast.success('Invitation accepted. You can start chatting now.');
                onAcceptedInvitation?.();
              },
              onError: (error) => toast.error(getErrorMessage(error)),
            });
          },
          onDecline: () => setShowDeclineDialog(true),
        }}
      />

      {showDeclineDialog && (
        <DeclineInvitationDialog
          companyName={conversation.companyName}
          inviteCount={conversation.inviteCount}
          maxInvites={conversation.maxInvites}
          isLoading={declineInvitation.isPending}
          onClose={() => {
            if (!declineInvitation.isPending) setShowDeclineDialog(false);
          }}
          onConfirm={() => {
            declineInvitation.mutate(conversation.id, {
              onSuccess: () => {
                setShowDeclineDialog(false);
                toast.success('Invitation declined.');
              },
              onError: (error) => toast.error(getErrorMessage(error)),
            });
          }}
        />
      )}
    </>
  );
}
