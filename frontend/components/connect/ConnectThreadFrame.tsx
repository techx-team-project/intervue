'use client';

import type { EditMessageInput, SendAttachmentInput, SendMessageInput } from '@/apiRequest/connect-client';
import ConnectComposerShell, {
  type ComposerEditTarget,
  type ComposerReplyTarget,
} from '@/components/connect/ConnectComposerShell';
import ConnectTimeline from '@/components/connect/ConnectTimeline';
import ContentViolationWarningModal from '@/components/connect/ContentViolationWarningModal';
import ConnectThreadHeader from '@/components/recruiter/connect/ConnectThreadHeader';
import { Button } from '@/components/ui/Button';
import { isApiError } from '@/lib/api-error';
import type {
  ConnectMessage,
  ConnectMuteStatus,
  ConnectPortal,
  ConversationSummary,
  LinkPreview,
  UnsendScope,
} from '@/types/connect';
import { createClientMessageId, getMessagePreviewText } from '@/utils/connect-chat';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2, Send, ShieldAlert, XCircle } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

type PendingControls = {
  onAccept: () => void;
  onDecline: () => void;
  isAccepting: boolean;
  isDeclining: boolean;
};

type ConnectThreadFrameProps = {
  portal: ConnectPortal;
  conversation: ConversationSummary;
  currentUserId: number;
  messages: ConnectMessage[];
  isLoading: boolean;
  hasOlder: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => Promise<unknown> | void;
  isComposerPending: boolean;
  isUnblocking: boolean;
  onSendText: (payload: SendMessageInput) => Promise<unknown>;
  onSendAttachment: (payload: SendAttachmentInput) => Promise<unknown>;
  onEditMessage: (messageId: number, payload: EditMessageInput) => Promise<unknown>;
  onUnsendMessage: (messageId: number, scope: UnsendScope) => Promise<unknown>;
  onReactMessage: (messageId: number, emoji: string) => Promise<unknown>;
  onMarkRead: (lastReadMessageId?: number) => void;
  onTypingChange: (typing: boolean) => void;
  onUnblock: () => Promise<unknown>;
  onDownloadAttachment: (message: ConnectMessage) => Promise<void>;
  onFetchLinkPreview: (url: string) => Promise<LinkPreview | null>;
  onBack?: () => void;
  renderBlockModal: (onClose: () => void) => ReactNode;
  renderReportModal: (onClose: () => void) => ReactNode;
  pendingControls?: PendingControls;
  onReinvite?: () => void;
  muteStatus?: ConnectMuteStatus;
  onMuteExpired?: () => void;
};

export default function ConnectThreadFrame({
  portal,
  conversation,
  currentUserId,
  messages,
  isLoading,
  hasOlder,
  isLoadingOlder,
  onLoadOlder,
  isComposerPending,
  isUnblocking,
  onSendText,
  onSendAttachment,
  onEditMessage,
  onUnsendMessage,
  onReactMessage,
  onMarkRead,
  onTypingChange,
  onUnblock,
  onDownloadAttachment,
  onFetchLinkPreview,
  onBack,
  renderBlockModal,
  renderReportModal,
  pendingControls,
  onReinvite,
  muteStatus,
  onMuteExpired,
}: ConnectThreadFrameProps) {
  const [replyTo, setReplyTo] = useState<ComposerReplyTarget | null>(null);
  const [editingMessage, setEditingMessage] = useState<ComposerEditTarget | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const viewerActorType = portal === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';
  const peerName = portal === 'recruiter' ? conversation.candidateName : conversation.companyName;
  const isMuted = Boolean(muteStatus?.muted);
  const inviteCount = conversation.inviteCount ?? 1;
  const maxInvites = conversation.maxInvites ?? 2;
  const hasReachedInviteLimit = inviteCount >= maxInvites;
  const reinviteTargetMs = conversation.reinviteAvailableAt
    ? new Date(conversation.reinviteAvailableAt).getTime()
    : NaN;
  const isInReinviteCooldown = Boolean(
    conversation.reinviteAvailableAt && Number.isFinite(reinviteTargetMs) && nowMs < reinviteTargetMs,
  );

  useEffect(() => {
    if (!muteStatus?.muted || !muteStatus.expiresAt || !onMuteExpired) return;
    const remainingMs = new Date(muteStatus.expiresAt).getTime() - Date.now();
    if (!Number.isFinite(remainingMs)) return;
    const delayMs = Math.max(0, Math.min(remainingMs + 500, 2_147_483_647));
    const timer = setTimeout(() => {
      onMuteExpired();
    }, delayMs);
    return () => clearTimeout(timer);
  }, [muteStatus?.muted, muteStatus?.expiresAt, onMuteExpired]);

  useEffect(() => {
    if (conversation.status !== 'DECLINED' || !conversation.reinviteAvailableAt) return;
    const targetMs = new Date(conversation.reinviteAvailableAt).getTime();
    if (!Number.isFinite(targetMs)) return;
    const remainingMs = targetMs - Date.now();
    const delayMs = Math.max(0, Math.min(remainingMs + 500, 2_147_483_647));
    const timer = setTimeout(() => {
      setNowMs(Date.now());
    }, delayMs);
    return () => clearTimeout(timer);
  }, [conversation.status, conversation.reinviteAvailableAt]);

  const handleActionError = (error: unknown) => {
    if (isApiError(error) && error.code === 'MESSAGE_BLOCKED_BY_FILTER') {
      setShowViolationModal(true);
      return;
    }
    toast.error(getErrorMessage(error));
  };

  const handleSendText = async (payload: SendMessageInput) => {
    try {
      await onSendText(payload);
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleSendAttachment = async (payload: SendAttachmentInput) => {
    try {
      await onSendAttachment(payload);
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleSaveEdit = async (messageId: number, body: string, suppressLinkPreview?: boolean) => {
    try {
      await onEditMessage(messageId, { body, suppressLinkPreview });
      setEditingMessage(null);
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleUnsend = async (messageId: number, scope: UnsendScope) => {
    try {
      await onUnsendMessage(messageId, scope);
      if (editingMessage?.id === messageId) {
        setEditingMessage(null);
      }
      if (replyTo?.id === messageId) {
        setReplyTo(null);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleReact = async (messageId: number, emoji: string) => {
    try {
      await onReactMessage(messageId, emoji);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUnblock = async () => {
    try {
      await onUnblock();
      toast.success('Conversation unblocked.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRetry = (failedMsg: ConnectMessage) => {
    const clientMessageId = failedMsg.clientMessageId ?? createClientMessageId();
    if (failedMsg.optimisticFile) {
      void handleSendAttachment({
        file: failedMsg.optimisticFile,
        caption: failedMsg.body,
        clientMessageId,
        replyToMessageId: failedMsg.replyToMessageId,
      });
      return;
    }
    if (failedMsg.body) {
      void handleSendText({
        body: failedMsg.body,
        clientMessageId,
        replyToMessageId: failedMsg.replyToMessageId,
        suppressLinkPreview: !failedMsg.linkUrl,
      });
    }
  };

  const pendingTimelineBanner =
    portal === 'candidate' && conversation.status === 'PENDING' ? (
      <div className="mx-auto mb-4 max-w-md rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-center">
        <p className="text-xs font-semibold text-slate-800">Chat invitation from {conversation.companyName}</p>
        <p className="mt-1 text-[11px] text-slate-500">
          Received on {formatDateTime(conversation.invitedAt)} · Respond below to accept or decline.
        </p>
      </div>
    ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <ConnectThreadHeader
        conversation={conversation}
        portal={portal}
        onBlock={() => setShowBlockModal(true)}
        onUnblock={handleUnblock}
        isUnblocking={isUnblocking}
        onReport={() => setShowReportModal(true)}
        onBack={onBack}
      />

      <ConnectTimeline
        portal={portal}
        conversation={conversation}
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        hasOlder={hasOlder}
        isLoadingOlder={isLoadingOlder}
        onLoadOlder={onLoadOlder}
        onMarkRead={onMarkRead}
        onReply={(msg) => {
          setEditingMessage(null);
          setReplyTo({
            id: msg.id,
            senderName: msg.senderName || peerName,
            previewText: getMessagePreviewText(msg),
          });
        }}
        onEdit={(msg) => {
          setReplyTo(null);
          setEditingMessage({
            id: msg.id,
            initialBody: msg.body ?? '',
            createdAt: msg.createdAt,
          });
        }}
        onUnsend={(id, scope) => void handleUnsend(id, scope)}
        onReact={(id, emoji) => void handleReact(id, emoji)}
        onDownloadAttachment={(msg) => void onDownloadAttachment(msg)}
        onRetry={handleRetry}
        topBanner={pendingTimelineBanner}
      />

      {conversation.status === 'BLOCKED' &&
        (conversation.blockedByActorType === viewerActorType ? (
          <div className="border-outline-variant flex flex-wrap items-center justify-between gap-3 border-t bg-slate-50 px-4 py-3 sm:px-6">
            <p className="text-xs font-medium text-slate-600">
              You blocked this conversation. Unblock to resume messaging.
            </p>
            <Button
              variant="outline"
              size="sm"
              radius="md"
              isLoading={isUnblocking}
              onClick={() => void handleUnblock()}
            >
              Unblock conversation
            </Button>
          </div>
        ) : (
          <div className="border-outline-variant text-on-surface-variant text-body-sm shrink-0 border-t bg-slate-50 px-5 py-3 text-center">
            This conversation has been blocked. Messaging is disabled.
          </div>
        ))}

      {conversation.status === 'DECLINED' && portal === 'candidate' && (
        <div className="border-outline-variant text-on-surface-variant text-body-sm shrink-0 border-t bg-slate-50 px-5 py-3 text-center">
          You declined this chat invitation.
        </div>
      )}

      {conversation.status === 'DECLINED' &&
        portal === 'recruiter' &&
        (hasReachedInviteLimit ? (
          <div className="border-outline-variant text-on-surface-variant text-body-sm shrink-0 border-t bg-slate-50 px-5 py-3 text-center">
            The candidate declined your chat invitations ({inviteCount}/{maxInvites} attempts used). You cannot invite
            this candidate again.
          </div>
        ) : isMuted ? (
          <div className="border-outline-variant shrink-0 border-t bg-rose-50/70 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <p className="text-xs leading-relaxed text-rose-800">
                  {muteStatus?.expiresAt ? (
                    <>
                      The candidate declined your invitation. You are temporarily restricted from sending invitations
                      until <span className="font-semibold">{formatDateTime(muteStatus.expiresAt)}</span>.
                    </>
                  ) : (
                    'The candidate declined your invitation. Your account is temporarily restricted from sending invitations.'
                  )}
                </p>
              </div>
              {onReinvite && (
                <Button type="button" size="sm" radius="md" disabled leftIcon={<Send className="h-3.5 w-3.5" />}>
                  Send new invitation
                </Button>
              )}
            </div>
          </div>
        ) : isInReinviteCooldown && conversation.reinviteAvailableAt ? (
          <div className="border-outline-variant shrink-0 border-t bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-slate-600">
                The candidate declined your invitation ({inviteCount}/{maxInvites}). You can send one final invitation
                after{' '}
                <span className="font-semibold text-slate-800">{formatDateTime(conversation.reinviteAvailableAt)}</span>
                .
              </p>
              {onReinvite && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  radius="md"
                  disabled
                  leftIcon={<Send className="h-3.5 w-3.5" />}
                >
                  Send new invitation
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="border-outline-variant shrink-0 border-t bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-slate-600">
                The candidate declined your invitation ({inviteCount}/{maxInvites}). You may send one final invitation.
              </p>
              {onReinvite && (
                <Button
                  type="button"
                  size="sm"
                  radius="md"
                  leftIcon={<Send className="h-3.5 w-3.5" />}
                  onClick={onReinvite}
                >
                  Send new invitation
                </Button>
              )}
            </div>
          </div>
        ))}

      {conversation.status === 'PENDING' && portal === 'recruiter' && (
        <div className="border-outline-variant text-on-surface-variant text-body-sm shrink-0 border-t bg-slate-50 px-5 py-3 text-center">
          Waiting for the candidate to accept your invitation before messaging.
        </div>
      )}

      {conversation.status === 'PENDING' && portal === 'candidate' && pendingControls && (
        <div className="border-outline-variant shrink-0 border-t bg-emerald-50/50 px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-800">{conversation.companyName}</span> invited you to connect.
              Accept to start chatting.
            </p>
            <div className="flex shrink-0 items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                radius="md"
                leftIcon={<XCircle className="h-4 w-4" />}
                disabled={pendingControls.isAccepting || pendingControls.isDeclining}
                isLoading={pendingControls.isDeclining}
                onClick={pendingControls.onDecline}
              >
                Decline
              </Button>
              <Button
                type="button"
                size="sm"
                radius="md"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                disabled={pendingControls.isAccepting || pendingControls.isDeclining}
                isLoading={pendingControls.isAccepting}
                onClick={pendingControls.onAccept}
              >
                Accept invitation
              </Button>
            </div>
          </div>
        </div>
      )}

      {conversation.status === 'ACCEPTED' &&
        (isMuted ? (
          <div className="border-outline-variant shrink-0 border-t bg-rose-50/70 px-4 py-3.5 sm:px-6">
            <div className="flex items-center justify-center gap-2 text-center">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <p className="text-xs leading-relaxed text-rose-800 sm:text-[13px]">
                {muteStatus?.expiresAt ? (
                  <>
                    You are temporarily restricted from sending messages until{' '}
                    <span className="font-semibold">{formatDateTime(muteStatus.expiresAt)}</span> due to community
                    guideline violations.
                  </>
                ) : (
                  'You are temporarily restricted from sending messages due to community guideline violations.'
                )}
              </p>
            </div>
          </div>
        ) : (
          <ConnectComposerShell
            portal={portal}
            placeholder="Type a message..."
            isPending={isComposerPending}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
            onSaveEdit={handleSaveEdit}
            onSendText={handleSendText}
            onSendAttachment={handleSendAttachment}
            onTypingChange={onTypingChange}
            onFetchLinkPreview={onFetchLinkPreview}
          />
        ))}

      <ContentViolationWarningModal isOpen={showViolationModal} onClose={() => setShowViolationModal(false)} />
      {showBlockModal && renderBlockModal(() => setShowBlockModal(false))}
      {showReportModal && renderReportModal(() => setShowReportModal(false))}
    </div>
  );
}
