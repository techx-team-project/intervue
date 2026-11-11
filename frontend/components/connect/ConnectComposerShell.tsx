'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { ConnectPortal, LinkPreview } from '@/types/connect';
import { createClientMessageId, extractFirstHttpUrl, formatConnectFileSize } from '@/utils/connect-chat';
import { Check, ExternalLink, FileText, Paperclip, Pencil, Reply, Send, Upload, X } from 'lucide-react';
import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { toast } from 'sonner';

const ALLOWED_EXTENSIONS = /\.(jpe?g|png|pdf|docx)$/i;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const TYPING_HEARTBEAT_MS = 2500;
const TYPING_STOP_DELAY_MS = 2800;

export type ComposerReplyTarget = {
  id: number;
  senderName: string;
  previewText: string;
};

export type ComposerEditTarget = {
  id: number;
  initialBody: string;
  createdAt: string;
};

type ConnectComposerShellProps = {
  portal: ConnectPortal;
  placeholder: string;
  isPending: boolean;
  replyTo?: ComposerReplyTarget | null;
  onCancelReply?: () => void;
  editingMessage?: ComposerEditTarget | null;
  onCancelEdit?: () => void;
  onSaveEdit?: (messageId: number, body: string, suppressLinkPreview?: boolean) => Promise<void> | void;
  onSendText: (payload: {
    body: string;
    clientMessageId: string;
    replyToMessageId?: number;
    suppressLinkPreview?: boolean;
  }) => Promise<void> | void;
  onSendAttachment: (payload: {
    file: File;
    caption?: string;
    clientMessageId: string;
    replyToMessageId?: number;
  }) => Promise<void> | void;
  onTypingChange?: (typing: boolean) => void;
  onFetchLinkPreview?: (url: string) => Promise<LinkPreview | null>;
  disabled?: boolean;
};

export default function ConnectComposerShell({
  placeholder,
  isPending,
  replyTo,
  onCancelReply,
  editingMessage,
  onCancelEdit,
  onSaveEdit,
  onSendText,
  onSendAttachment,
  onTypingChange,
  onFetchLinkPreview,
  disabled = false,
}: ConnectComposerShellProps) {
  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<{ url: string; data: LinkPreview | null; imgFailed: boolean } | null>(
    null,
  );
  const [dismissedPreviewUrl, setDismissedPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevEditId, setPrevEditId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendLockRef = useRef(false);
  const lastTypingSentAtRef = useRef(0);
  const typingActiveRef = useRef(false);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEditing = Boolean(editingMessage);
  const currentEditId = editingMessage?.id ?? null;

  if (currentEditId !== prevEditId) {
    setPrevEditId(currentEditId);
    if (editingMessage) {
      setBody(editingMessage.initialBody);
      setSelectedFile(null);
      setDismissedPreviewUrl(null);
    } else {
      setBody('');
    }
  }

  const imagePreviewUrl = useMemo(() => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const stopTyping = useCallback(() => {
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = null;
    }
    if (typingActiveRef.current) {
      typingActiveRef.current = false;
      onTypingChange?.(false);
    }
  }, [onTypingChange]);

  const signalTyping = useCallback(() => {
    if (!onTypingChange || isEditing || disabled) return;
    const now = Date.now();
    if (!typingActiveRef.current || now - lastTypingSentAtRef.current >= TYPING_HEARTBEAT_MS) {
      typingActiveRef.current = true;
      lastTypingSentAtRef.current = now;
      onTypingChange(true);
    }
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
    }
    typingStopTimerRef.current = setTimeout(() => {
      typingActiveRef.current = false;
      onTypingChange(false);
    }, TYPING_STOP_DELAY_MS);
  }, [disabled, isEditing, onTypingChange]);

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [stopTyping]);

  useEffect(() => {
    if (currentEditId !== null) {
      stopTyping();
      textareaRef.current?.focus();
    }
  }, [currentEditId, stopTyping]);

  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus();
    }
  }, [replyTo]);

  const detectedUrl = useMemo(() => (selectedFile ? null : extractFirstHttpUrl(body)), [body, selectedFile]);

  useEffect(() => {
    if (!detectedUrl || dismissedPreviewUrl === detectedUrl || !onFetchLinkPreview) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      void onFetchLinkPreview(detectedUrl)
        .then((res) => {
          if (!cancelled && res) {
            setPreviewData({ url: detectedUrl, data: res, imgFailed: false });
          } else if (!cancelled) {
            setPreviewData({ url: detectedUrl, data: null, imgFailed: false });
          }
        })
        .catch(() => {
          if (!cancelled) {
            setPreviewData({ url: detectedUrl, data: null, imgFailed: false });
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [detectedUrl, dismissedPreviewUrl, onFetchLinkPreview]);

  const activeLinkPreview =
    detectedUrl && dismissedPreviewUrl !== detectedUrl && previewData?.url === detectedUrl ? previewData.data : null;

  const validateAndStageFile = useCallback(
    (file: File) => {
      if (isEditing) {
        toast.info('Finish or cancel editing before attaching a file.');
        return;
      }
      if (!ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.test(file.name)) {
        toast.error('Only JPEG, PNG, PDF, and DOCX files are supported.');
        return;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error('Attachment exceeds the 10 MB limit.');
        return;
      }
      setSelectedFile(file);
      textareaRef.current?.focus();
    },
    [isEditing],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    validateAndStageFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (disabled || isEditing) return;
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || isEditing) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      validateAndStageFile(file);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (disabled || isEditing) return;
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const pastedFile = item.getAsFile();
        if (pastedFile) {
          event.preventDefault();
          validateAndStageFile(pastedFile);
          return;
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (disabled || isPending || sendLockRef.current) return;

    const trimmed = body.trim();
    if (isEditing && editingMessage) {
      if (!trimmed) {
        toast.error('Message cannot be empty.');
        return;
      }
      sendLockRef.current = true;
      const suppress = Boolean(detectedUrl && dismissedPreviewUrl === detectedUrl);
      try {
        await onSaveEdit?.(editingMessage.id, trimmed, suppress);
        setBody('');
        setPreviewData(null);
        setDismissedPreviewUrl(null);
      } finally {
        sendLockRef.current = false;
      }
      return;
    }

    if (!selectedFile && !trimmed) return;

    sendLockRef.current = true;
    const fileToSend = selectedFile;
    const replyToMessageId = replyTo?.id;
    const suppressLinkPreview = Boolean(detectedUrl && dismissedPreviewUrl === detectedUrl);
    const clientMessageId = createClientMessageId();

    setBody('');
    setSelectedFile(null);
    setPreviewData(null);
    setDismissedPreviewUrl(null);
    onCancelReply?.();
    stopTyping();

    try {
      if (fileToSend) {
        await onSendAttachment({
          file: fileToSend,
          caption: trimmed || undefined,
          clientMessageId,
          replyToMessageId,
        });
      } else {
        await onSendText({
          body: trimmed,
          clientMessageId,
          replyToMessageId,
          suppressLinkPreview,
        });
      }
    } finally {
      sendLockRef.current = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || event.key === 'Process' || event.keyCode === 229 || event.repeat) {
      return;
    }
    if (event.key === 'Escape' && isEditing) {
      event.preventDefault();
      setBody('');
      onCancelEdit?.();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const canSubmit = isEditing
    ? Boolean(body.trim()) && !isPending && !disabled
    : (Boolean(body.trim()) || Boolean(selectedFile)) && !isPending && !disabled;

  const lineCount = Math.min(5, Math.max(1, body.split('\n').length));

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-outline-variant relative shrink-0 border-t bg-white px-4 py-3 transition-colors',
        isDragging && 'bg-emerald-50/70',
      )}
    >
      {isDragging && (
        <div className="border-primary/50 pointer-events-none absolute inset-2 z-20 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-emerald-50/90 text-xs font-semibold text-emerald-700">
          <Upload className="h-4 w-4" />
          <span>Drop file or image to attach</span>
        </div>
      )}

      {isEditing && editingMessage && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs">
          <div className="flex min-w-0 items-center gap-2 text-amber-900">
            <Pencil className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="font-semibold">Editing message</p>
              <p className="truncate text-[11px] text-amber-700">Press Esc to cancel or Enter to save changes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setBody('');
              onCancelEdit?.();
            }}
            aria-label="Cancel editing"
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-amber-700 hover:bg-amber-200/60"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {!isEditing && replyTo && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <div className="flex min-w-0 items-start gap-2">
            <Reply className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-700">Replying to {replyTo.senderName}</p>
              <p className="truncate text-slate-500">{replyTo.previewText}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            aria-label="Cancel reply"
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {selectedFile && !isEditing && (
        <div className="bg-surface-container-low mb-2.5 flex items-center gap-3 rounded-xl px-3 py-2">
          {imagePreviewUrl ? (
            <Image
              src={imagePreviewUrl}
              alt={selectedFile.name}
              width={44}
              height={44}
              unoptimized
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="bg-primary-light text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-body-sm text-on-surface truncate font-medium">{selectedFile.name}</p>
            <p className="text-label-sm text-on-surface-variant">{formatConnectFileSize(selectedFile.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            aria-label="Remove attachment"
            className="text-on-surface-variant hover:text-on-surface flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!selectedFile && activeLinkPreview && (
        <div className="mb-2.5 flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-xs">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {activeLinkPreview.imageUrl && !previewData?.imgFailed ? (
              <Image
                src={activeLinkPreview.imageUrl}
                alt={activeLinkPreview.title ?? 'Link preview'}
                width={48}
                height={48}
                unoptimized
                onError={() => setPreviewData((prev) => (prev ? { ...prev, imgFailed: true } : prev))}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200/80 text-slate-600">
                <ExternalLink className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800">
                {activeLinkPreview.title || activeLinkPreview.url}
              </p>
              {activeLinkPreview.description && (
                <p className="line-clamp-1 text-slate-500">{activeLinkPreview.description}</p>
              )}
              <p className="truncate text-[11px] text-slate-400">{activeLinkPreview.url}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissedPreviewUrl(detectedUrl)}
            aria-label="Remove link preview"
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.docx,image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
        />

        {!isEditing && (
          <button
            type="button"
            disabled={isPending || disabled}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image or document (max 10 MB)"
            aria-label="Attach file"
            className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:opacity-40"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        )}

        <textarea
          ref={textareaRef}
          rows={lineCount}
          value={body}
          disabled={disabled}
          onChange={(event) => {
            const nextVal = event.target.value;
            setBody(nextVal);
            if (!nextVal.trim()) {
              stopTyping();
            } else {
              signalTyping();
            }
          }}
          onBlur={() => stopTyping()}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="border-outline-variant bg-surface-container-low text-body-md text-on-surface placeholder:text-on-surface-variant [field-sizing:content] max-h-32 min-h-[38px] flex-1 resize-none rounded-2xl border px-3.5 py-2 leading-snug transition-colors focus:border-slate-300 focus:bg-white focus:outline-none"
        />

        <Button
          type="button"
          size="sm"
          radius="full"
          disabled={!canSubmit}
          isLoading={isPending}
          onClick={() => void handleSubmit()}
          aria-label={isEditing ? 'Save edit' : 'Send message'}
          className="h-9 w-9 shrink-0 px-0!"
        >
          {!isPending && (isEditing ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />)}
        </Button>
      </div>
    </div>
  );
}
