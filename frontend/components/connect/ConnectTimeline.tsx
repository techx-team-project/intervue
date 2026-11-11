'use client';

import Spinner from '@/components/common/Spinner';
import ConnectMessageBubble from '@/components/connect/ConnectMessageBubble';
import ImageLightboxModal from '@/components/connect/ImageLightboxModal';
import UserAvatar from '@/components/ui/UserAvatar';
import { useConnectUiStore } from '@/store/connect-ui.store';
import type { ConnectMessage, ConnectPortal, ConversationSummary, UnsendScope } from '@/types/connect';
import { formatConnectDividerTime, formatConnectExactTime, shouldShowTimelineDivider } from '@/utils/connect-chat';
import { ArrowDown, Check } from 'lucide-react';
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const NEAR_BOTTOM_PX = 120;

type ConnectTimelineProps = {
  portal: ConnectPortal;
  conversation: ConversationSummary;
  messages: ConnectMessage[];
  currentUserId: number;
  isLoading: boolean;
  hasOlder: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => Promise<unknown> | void;
  onMarkRead: (lastReadMessageId?: number) => void;
  onReply: (message: ConnectMessage) => void;
  onEdit: (message: ConnectMessage) => void;
  onUnsend: (messageId: number, scope: UnsendScope) => void;
  onReact: (messageId: number, emoji: string) => void;
  onDownloadAttachment: (message: ConnectMessage) => void;
  onRetry?: (message: ConnectMessage) => void;
  topBanner?: ReactNode;
};

export default function ConnectTimeline({
  portal,
  conversation,
  messages,
  currentUserId,
  isLoading,
  hasOlder,
  isLoadingOlder,
  onLoadOlder,
  onMarkRead,
  onReply,
  onEdit,
  onUnsend,
  onReact,
  onDownloadAttachment,
  onRetry,
  topBanner,
}: ConnectTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const initialScrolledIdRef = useRef<number | null>(null);
  const pendingScrollRestoreRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(null);
  const lastProcessedNewestIdRef = useRef<number | null>(null);
  const lastMarkedReadIdRef = useRef<number>(0);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isNearBottom, setIsNearBottom] = useState(true);
  const [seenNewestId, setSeenNewestId] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const setActiveThread = useConnectUiStore((s) => s.setActiveThread);
  const setAtBottom = useConnectUiStore((s) => s.setAtBottom);
  const typingMap = useConnectUiStore((s) => s.typingByThread[`${portal}:${conversation.id}`]);

  const currentActorType = portal === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';
  const peerName = portal === 'recruiter' ? conversation.candidateName : conversation.companyName;

  const activeTypers = useMemo(() => {
    if (!typingMap) return [];
    return Object.values(typingMap).filter(
      (entry) => !(entry.actorType === currentActorType && (portal === 'candidate' || entry.actorId === currentUserId)),
    );
  }, [typingMap, currentActorType, portal, currentUserId]);

  const imageMessages = useMemo(
    () => messages.filter((m) => m.messageType === 'IMAGE' && !m.recalled && Boolean(m.attachmentUrl)),
    [messages],
  );

  const latestRealMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].id > 0) return messages[i];
    }
    return null;
  }, [messages]);

  const newestMessage = messages[messages.length - 1] ?? null;

  // Determine which sent message receives the Seen / Delivered indicator.
  const receiptTarget = useMemo(() => {
    const isSenderSide = (msg: ConnectMessage) =>
      portal === 'recruiter' ? msg.senderType === 'RECRUITER' : msg.senderType === 'CANDIDATE';

    const peerLastReadId = conversation.peerLastReadMessageId ?? 0;
    let lastSeenOwnId: number | null = null;
    if (peerLastReadId > 0) {
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        const msg = messages[i];
        if (msg.id > 0 && !msg.recalled && !msg.optimisticStatus && isSenderSide(msg) && msg.id <= peerLastReadId) {
          lastSeenOwnId = msg.id;
          break;
        }
      }
    }

    const latestMsg = messages[messages.length - 1];
    const showDeliveredId =
      conversation.status === 'ACCEPTED' &&
      latestMsg &&
      latestMsg.id > 0 &&
      !latestMsg.recalled &&
      !latestMsg.optimisticStatus &&
      isSenderSide(latestMsg) &&
      latestMsg.id > peerLastReadId
        ? latestMsg.id
        : null;

    return { lastSeenOwnId, showDeliveredId };
  }, [conversation.peerLastReadMessageId, conversation.status, messages, portal]);

  useEffect(() => {
    setActiveThread(portal, conversation.id);
    setAtBottom(portal, true);
    lastMarkedReadIdRef.current = 0;
    return () => {
      setActiveThread(portal, null);
    };
  }, [conversation.id, portal, setActiveThread, setAtBottom]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  const maybeMarkRead = useCallback(() => {
    if (!latestRealMessage || !nearBottomRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    const latestId = latestRealMessage.id;
    const latestFromPeer =
      latestRealMessage.senderType !== currentActorType ||
      (portal === 'recruiter' && latestRealMessage.senderId !== currentUserId);
    const shouldMark = conversation.unreadCount > 0 || (latestFromPeer && latestId > lastMarkedReadIdRef.current);

    if (shouldMark) {
      lastMarkedReadIdRef.current = latestId;
      onMarkRead(latestId);
    }
  }, [latestRealMessage, currentActorType, portal, currentUserId, conversation.unreadCount, onMarkRead]);

  useEffect(() => {
    maybeMarkRead();
  }, [maybeMarkRead]);

  useEffect(() => {
    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        maybeMarkRead();
      }
    };
    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);
    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
  }, [maybeMarkRead]);

  const handleLoadOlder = useCallback(async () => {
    if (!hasOlder || isLoadingOlder || !scrollRef.current) return;
    const el = scrollRef.current;
    pendingScrollRestoreRef.current = {
      scrollHeight: el.scrollHeight,
      scrollTop: el.scrollTop,
    };
    await onLoadOlder();
  }, [hasOlder, isLoadingOlder, onLoadOlder]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || isLoading) return;

    if (!isLoadingOlder && pendingScrollRestoreRef.current) {
      const { scrollHeight, scrollTop } = pendingScrollRestoreRef.current;
      el.scrollTop = el.scrollHeight - scrollHeight + scrollTop;
      pendingScrollRestoreRef.current = null;
      return;
    }

    if (initialScrolledIdRef.current !== conversation.id && messages.length > 0) {
      el.scrollTop = el.scrollHeight;
      initialScrolledIdRef.current = conversation.id;
      nearBottomRef.current = true;
      lastProcessedNewestIdRef.current = newestMessage?.id ?? null;
      return;
    }

    const currentNewestId = newestMessage?.id ?? null;
    if (currentNewestId !== null && currentNewestId !== lastProcessedNewestIdRef.current) {
      lastProcessedNewestIdRef.current = currentNewestId;
      const isNewestOwn =
        newestMessage?.senderType === currentActorType &&
        (portal === 'candidate' || newestMessage?.senderId === currentUserId);
      if (nearBottomRef.current || isNewestOwn) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [
    conversation.id,
    currentActorType,
    currentUserId,
    isLoading,
    isLoadingOlder,
    messages.length,
    newestMessage,
    portal,
  ]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollTop <= 60 && hasOlder && !isLoadingOlder) {
      void handleLoadOlder();
    }

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom <= NEAR_BOTTOM_PX;
    nearBottomRef.current = nearBottom;
    setIsNearBottom(nearBottom);
    setAtBottom(portal, nearBottom);

    if (nearBottom) {
      if (newestMessage) {
        setSeenNewestId(newestMessage.id);
      }
      maybeMarkRead();
    }
  };

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    nearBottomRef.current = true;
    setIsNearBottom(true);
    setAtBottom(portal, true);
    if (newestMessage) {
      setSeenNewestId(newestMessage.id);
    }
    maybeMarkRead();
  };

  const jumpToMessage = (targetId: number) => {
    const targetEl = document.getElementById(`connect-msg-${targetId}`);
    if (!targetEl) return;
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedId(targetId);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedId(null);
    }, 1800);
  };

  const showNewMessagesPill =
    !isNearBottom &&
    newestMessage !== null &&
    seenNewestId !== null &&
    newestMessage.id !== seenNewestId &&
    !(
      newestMessage.senderType === currentActorType &&
      (portal === 'candidate' || newestMessage.senderId === currentUserId)
    );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {hasOlder && (
          <div className="mb-3 flex justify-center">
            <button
              type="button"
              disabled={isLoadingOlder}
              onClick={() => void handleLoadOlder()}
              className="text-primary border-outline-variant cursor-pointer rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              {isLoadingOlder ? 'Loading older messages...' : 'Load older messages'}
            </button>
          </div>
        )}

        {topBanner}

        {isLoading && messages.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col pb-2">
            {messages.map((message, index) => {
              const prev = messages[index - 1];
              const next = messages[index + 1];
              const showDivider = shouldShowTimelineDivider(prev, message);
              const isSeenHere = receiptTarget.lastSeenOwnId === message.id;
              const isDeliveredHere = receiptTarget.showDeliveredId === message.id;

              return (
                <Fragment key={message.clientMessageId ? `cid-${message.clientMessageId}` : `id-${message.id}`}>
                  {showDivider && (
                    <div className="my-4 flex justify-center">
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-medium text-slate-500">
                        {formatConnectDividerTime(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <ConnectMessageBubble
                    portal={portal}
                    currentUserId={currentUserId}
                    peerName={peerName}
                    message={message}
                    prevMessage={showDivider ? undefined : prev}
                    nextMessage={next && shouldShowTimelineDivider(message, next) ? undefined : next}
                    isHighlighted={highlightedId === message.id}
                    onReply={onReply}
                    onEdit={onEdit}
                    onUnsend={onUnsend}
                    onReact={onReact}
                    onImageClick={(clicked) => {
                      const idx = imageMessages.findIndex((img) => img.id === clicked.id);
                      if (idx >= 0) setLightboxIndex(idx);
                    }}
                    onDownloadAttachment={onDownloadAttachment}
                    onRetry={onRetry}
                    onJumpToMessage={jumpToMessage}
                  />

                  {isSeenHere && (
                    <div
                      title={
                        conversation.peerLastReadAt
                          ? `Seen ${formatConnectExactTime(conversation.peerLastReadAt)}`
                          : 'Seen'
                      }
                      className="mt-1 flex items-center justify-end pr-0.5 text-[11px] font-medium text-slate-400"
                    >
                      <span>Seen</span>
                    </div>
                  )}

                  {isDeliveredHere && (
                    <div className="mt-1 flex items-center justify-end gap-1 pr-0.5 text-[11px] text-slate-400">
                      <Check className="h-3 w-3" />
                      <span>Delivered</span>
                    </div>
                  )}
                </Fragment>
              );
            })}

            {activeTypers.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <UserAvatar
                  fullName={activeTypers[0].actorName || peerName}
                  size="sm"
                  className="h-7 w-7 rounded-full text-[10px]"
                />
                <div className="bg-surface-container-low inline-flex items-center gap-2 rounded-2xl rounded-bl-sm px-3.5 py-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1" aria-hidden>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </span>
                  <span>
                    {activeTypers.length === 1
                      ? `${activeTypers[0].actorName} is typing...`
                      : `${activeTypers.map((t) => t.actorName).join(', ')} are typing...`}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showNewMessagesPill && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="bg-primary hover:bg-primary/90 absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition-transform active:scale-95"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          <span>New messages</span>
        </button>
      )}

      {lightboxIndex !== null && imageMessages.length > 0 && (
        <ImageLightboxModal
          images={imageMessages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onDownload={onDownloadAttachment}
        />
      )}
    </div>
  );
}
