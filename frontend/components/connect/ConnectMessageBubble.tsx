'use client';

import UserAvatar from '@/components/ui/UserAvatar';
import { cn } from '@/lib/utils';
import type { ConnectMessage, ConnectPortal, UnsendScope } from '@/types/connect';
import {
  CONNECT_REACTION_EMOJIS,
  canEditConnectMessage,
  formatConnectExactTime,
  formatConnectFileSize,
  isClusteredWithNext,
  isClusteredWithPrev,
} from '@/utils/connect-chat';
import {
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  EyeOff,
  FileText,
  MoreVertical,
  Pencil,
  Reply,
  RotateCw,
  SmilePlus,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g;
const URL_TEST_REGEX = /^https?:\/\/[^\s]+$/;

type ConnectMessageBubbleProps = {
  portal: ConnectPortal;
  currentUserId: number;
  peerName: string;
  message: ConnectMessage;
  prevMessage?: ConnectMessage;
  nextMessage?: ConnectMessage;
  isHighlighted?: boolean;
  onReply: (message: ConnectMessage) => void;
  onEdit: (message: ConnectMessage) => void;
  onUnsend: (messageId: number, scope: UnsendScope) => void;
  onReact: (messageId: number, emoji: string) => void;
  onImageClick: (message: ConnectMessage) => void;
  onDownloadAttachment: (message: ConnectMessage) => void;
  onRetry?: (message: ConnectMessage) => void;
  onJumpToMessage?: (messageId: number) => void;
};

type GroupedReaction = {
  emoji: string;
  count: number;
  actors: string[];
  mine: boolean;
};

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function renderLinkifiedText(text: string, isPrimaryBubble: boolean) {
  const parts = text.split(URL_SPLIT_REGEX);
  return parts.map((part, idx) => {
    if (URL_TEST_REGEX.test(part)) {
      return (
        <a
          key={`${idx}-${part}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'break-all underline transition-opacity hover:opacity-85',
            isPrimaryBubble ? 'text-white decoration-white/75' : 'text-primary decoration-primary/60',
          )}
        >
          {part}
        </a>
      );
    }
    return <Fragment key={idx}>{part}</Fragment>;
  });
}

export default function ConnectMessageBubble({
  portal,
  currentUserId,
  peerName,
  message,
  prevMessage,
  nextMessage,
  isHighlighted = false,
  onReply,
  onEdit,
  onUnsend,
  onReact,
  onImageClick,
  onDownloadAttachment,
  onRetry,
  onJumpToMessage,
}: ConnectMessageBubbleProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [failedPreviewUrl, setFailedPreviewUrl] = useState<string | null>(null);
  const [failedAttachmentUrl, setFailedAttachmentUrl] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen && !menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [pickerOpen, menuOpen]);

  const currentActorType = portal === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';
  const isCompanySide = message.senderType === 'RECRUITER';
  const isRightAligned = portal === 'recruiter' ? isCompanySide : !isCompanySide;
  const isExactSelf =
    message.senderType === currentActorType && (portal === 'candidate' || message.senderId === currentUserId);
  const isColleagueHr = portal === 'recruiter' && isCompanySide && !isExactSelf;
  const isOwnPrimaryBubble = isRightAligned && !isColleagueHr;

  const clusteredPrev = isClusteredWithPrev(prevMessage, message);
  const clusteredNext = isClusteredWithNext(message, nextMessage);
  const showSenderLabel =
    !clusteredPrev &&
    (isColleagueHr ||
      (!isRightAligned && portal === 'candidate') ||
      (portal === 'recruiter' &&
        isExactSelf &&
        prevMessage?.senderType === 'RECRUITER' &&
        prevMessage.senderId !== currentUserId));

  const senderLabelText = isExactSelf ? 'You' : message.senderName || peerName;
  const canEdit = canEditConnectMessage(message, isExactSelf);
  const isOptimistic = Boolean(message.optimisticStatus);
  const exactTimeTooltip = formatConnectExactTime(message.createdAt);

  const groupedReactions = useMemo<GroupedReaction[]>(() => {
    const map = new Map<string, GroupedReaction>();
    for (const reaction of message.reactions ?? []) {
      const existing = map.get(reaction.emoji);
      const isMine =
        reaction.actorType === currentActorType && (portal === 'candidate' || reaction.actorId === currentUserId);
      if (existing) {
        existing.count += 1;
        existing.actors.push(reaction.actorName);
        if (isMine) existing.mine = true;
      } else {
        map.set(reaction.emoji, {
          emoji: reaction.emoji,
          count: 1,
          actors: [reaction.actorName],
          mine: isMine,
        });
      }
    }
    return Array.from(map.values());
  }, [message.reactions, currentActorType, portal, currentUserId]);

  const bubbleRounding = isRightAligned
    ? cn(
        'rounded-2xl',
        clusteredPrev && 'rounded-tr-md',
        clusteredNext && 'rounded-br-md',
        !clusteredNext && 'rounded-br-sm',
      )
    : cn(
        'rounded-2xl',
        clusteredPrev && 'rounded-tl-md',
        clusteredNext && 'rounded-bl-md',
        !clusteredNext && 'rounded-bl-sm',
      );

  const hasLinkPreview =
    !message.recalled && Boolean(message.linkTitle || message.linkDescription || message.linkImageUrl);
  const showLinkThumb = Boolean(message.linkImageUrl) && failedPreviewUrl !== message.linkImageUrl;
  const showImagePreview =
    message.messageType === 'IMAGE' && Boolean(message.attachmentUrl) && failedAttachmentUrl !== message.attachmentUrl;

  const actionsBar = !isOptimistic && (
    <div
      ref={actionsRef}
      className={cn(
        'relative flex shrink-0 items-center gap-0.5 self-center transition-opacity',
        pickerOpen || menuOpen ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
      )}
    >
      {!message.recalled && (
        <>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setPickerOpen((open) => !open);
            }}
            aria-label="React to message"
            title="React"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <SmilePlus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPickerOpen(false);
              setMenuOpen(false);
              onReply(message);
            }}
            aria-label="Reply to message"
            title="Reply"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <Reply className="h-3.5 w-3.5" />
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setPickerOpen(false);
          setMenuOpen((open) => !open);
        }}
        aria-label="More message actions"
        title="More"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {pickerOpen && !message.recalled && (
        <div
          className={cn(
            'border-outline-variant absolute bottom-full z-30 mb-1.5 flex items-center gap-1 rounded-full border bg-white px-2 py-1 shadow-lg',
            isRightAligned ? 'right-0' : 'left-0',
          )}
        >
          {CONNECT_REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setPickerOpen(false);
                onReact(message.id, emoji);
              }}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-base transition-transform hover:scale-125 hover:bg-slate-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {menuOpen && (
        <div
          className={cn(
            'border-outline-variant absolute bottom-full z-30 mb-1.5 min-w-[172px] rounded-lg border bg-white py-1 text-xs shadow-lg',
            isRightAligned ? 'right-0' : 'left-0',
          )}
        >
          {!message.recalled && message.body && (
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(message.body ?? '');
                toast.success('Copied to clipboard');
                setMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
            >
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy text</span>
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(message);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
            >
              <Pencil className="h-3.5 w-3.5 text-slate-400" />
              <span>Edit message</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onUnsend(message.id, 'ME');
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
          >
            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
            <span>Remove for you</span>
          </button>
          {isExactSelf && !message.recalled && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onUnsend(message.id, 'EVERYONE');
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Unsend for everyone</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      id={message.id > 0 ? `connect-msg-${message.id}` : undefined}
      className={cn(
        'group flex w-full flex-col transition-colors duration-300',
        clusteredPrev ? 'mt-0.5' : 'mt-3',
        isRightAligned ? 'items-end' : 'items-start',
        isHighlighted && '-mx-1 rounded-xl bg-amber-50/80 p-1 ring-2 ring-amber-300/80',
      )}
    >
      {showSenderLabel && (
        <span
          className={cn(
            'mb-1 text-[11px] font-medium text-slate-500',
            isRightAligned ? 'pr-1 text-right' : 'pl-9 text-left',
          )}
        >
          {isColleagueHr ? `${senderLabelText} · HR` : senderLabelText}
        </span>
      )}

      <div
        className={cn(
          'flex max-w-[85%] items-end gap-2 sm:max-w-[74%]',
          isRightAligned ? 'flex-row-reverse' : 'flex-row',
        )}
      >
        {!isRightAligned &&
          (!clusteredNext ? (
            <UserAvatar
              fullName={message.senderName || peerName}
              size="sm"
              className="h-7 w-7 rounded-full text-[10px]"
            />
          ) : (
            <div className="w-7 shrink-0" />
          ))}

        <div className={cn('flex flex-col', isRightAligned ? 'items-end' : 'items-start')}>
          {message.replyTo && !message.recalled && (
            <button
              type="button"
              onClick={() => onJumpToMessage?.(message.replyTo!.id)}
              className={cn(
                'mb-1 flex max-w-xs cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1 text-left text-[11px] transition-colors',
                isRightAligned
                  ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              )}
            >
              <Reply className="h-3 w-3 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <span className="font-semibold text-slate-700">{message.replyTo.senderName}: </span>
                <span className="truncate italic">
                  {message.replyTo.recalled
                    ? 'Message unsent'
                    : message.replyTo.body || message.replyTo.attachmentFileName || 'Attachment'}
                </span>
              </div>
            </button>
          )}

          <div className={cn('flex items-center gap-1.5', isRightAligned ? 'flex-row-reverse' : 'flex-row')}>
            {message.recalled ? (
              <div
                title={exactTimeTooltip}
                className={cn(
                  'border-outline-variant border bg-slate-50/90 px-3.5 py-2 text-xs text-slate-400 italic',
                  bubbleRounding,
                )}
              >
                Message unsent
              </div>
            ) : (
              <div
                title={exactTimeTooltip}
                className={cn(
                  'relative px-3.5 py-2 text-sm leading-relaxed break-words transition-opacity',
                  bubbleRounding,
                  isOwnPrimaryBubble && 'bg-primary text-white',
                  isColleagueHr && 'border border-emerald-200 bg-emerald-50/90 text-slate-900',
                  !isRightAligned && 'bg-surface-container-low text-on-surface',
                  message.optimisticStatus === 'SENDING' && 'opacity-70',
                )}
              >
                {showImagePreview && (
                  <button
                    type="button"
                    onClick={() => onImageClick(message)}
                    aria-label="Open image in lightbox"
                    className="block cursor-zoom-in overflow-hidden rounded-xl"
                  >
                    <Image
                      src={message.attachmentUrl!}
                      alt={message.attachmentFileName ?? 'Chat image'}
                      width={320}
                      height={240}
                      unoptimized
                      onError={() => setFailedAttachmentUrl(message.attachmentUrl ?? null)}
                      className="h-auto max-h-72 w-auto max-w-full rounded-xl object-cover transition-transform duration-150 hover:scale-[1.01]"
                    />
                  </button>
                )}

                {(message.messageType === 'FILE' || (message.messageType === 'IMAGE' && !showImagePreview)) && (
                  <button
                    type="button"
                    onClick={() => onDownloadAttachment(message)}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors',
                      isOwnPrimaryBubble
                        ? 'bg-white/15 text-white hover:bg-white/20'
                        : 'text-on-surface border border-slate-200 bg-white hover:bg-slate-50',
                    )}
                  >
                    <FileText className="h-5 w-5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{message.attachmentFileName ?? 'Attachment'}</p>
                      {message.attachmentFileSizeBytes !== undefined && (
                        <p
                          className={cn(
                            'text-[11px]',
                            isOwnPrimaryBubble ? 'text-white/80' : 'text-on-surface-variant',
                          )}
                        >
                          {formatConnectFileSize(message.attachmentFileSizeBytes)}
                        </p>
                      )}
                    </div>
                    <Download className="h-4 w-4 shrink-0" />
                  </button>
                )}

                {message.body &&
                  !(
                    (message.messageType === 'FILE' || message.messageType === 'IMAGE') &&
                    message.body === message.attachmentFileName
                  ) && (
                    <p
                      className={cn(
                        'whitespace-pre-wrap',
                        (message.messageType === 'IMAGE' || message.messageType === 'FILE') && 'mt-2',
                      )}
                    >
                      {renderLinkifiedText(message.body, isOwnPrimaryBubble)}
                    </p>
                  )}

                {hasLinkPreview && message.linkUrl && (
                  <a
                    href={message.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'mt-2 block overflow-hidden rounded-xl border transition-colors',
                      isOwnPrimaryBubble
                        ? 'border-white/25 bg-white text-slate-900 hover:bg-slate-50'
                        : 'border-outline-variant text-on-surface bg-white hover:bg-slate-50',
                    )}
                  >
                    {showLinkThumb && (
                      <Image
                        src={message.linkImageUrl!}
                        alt={message.linkTitle ?? 'Link preview'}
                        width={320}
                        height={160}
                        unoptimized
                        onError={() => setFailedPreviewUrl(message.linkImageUrl ?? null)}
                        className="h-36 w-full object-cover"
                      />
                    )}
                    <div className="p-2.5">
                      {message.linkTitle && (
                        <p className="line-clamp-2 text-xs font-semibold text-slate-900">{message.linkTitle}</p>
                      )}
                      {message.linkDescription && (
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{message.linkDescription}</p>
                      )}
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{safeHostname(message.linkUrl)}</span>
                      </span>
                    </div>
                  </a>
                )}
              </div>
            )}

            {actionsBar}
          </div>

          {groupedReactions.length > 0 && !message.recalled && (
            <div className={cn('mt-1 flex flex-wrap gap-1', isRightAligned ? 'justify-end' : 'justify-start')}>
              {groupedReactions.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  title={item.actors.join(', ')}
                  onClick={() => onReact(message.id, item.emoji)}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors',
                    item.mine
                      ? 'border-primary/40 bg-emerald-50 font-semibold text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <span>{item.emoji}</span>
                  {item.count > 1 && <span>{item.count}</span>}
                </button>
              ))}
            </div>
          )}

          {message.editedAt && !message.recalled && !message.optimisticStatus && (
            <span
              title={`Edited ${formatConnectExactTime(message.editedAt)}`}
              className="mt-0.5 px-1 text-[10px] text-slate-400"
            >
              Edited
            </span>
          )}

          {message.optimisticStatus === 'SENDING' && (
            <span className="mt-0.5 px-1 text-[10px] text-slate-400">Sending...</span>
          )}

          {message.optimisticStatus === 'FAILED' && (
            <div className="mt-1 flex items-center gap-1.5 px-1 text-[11px] text-rose-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{message.optimisticError || 'Failed to send'}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(message)}
                  className="inline-flex cursor-pointer items-center gap-1 font-semibold underline hover:text-rose-700"
                >
                  <RotateCw className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
