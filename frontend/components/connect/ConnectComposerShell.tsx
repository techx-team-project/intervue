'use client';

import ContentViolationWarningModal from '@/components/connect/ContentViolationWarningModal';
import { isApiError } from '@/lib/api-error';
import type { ConnectMuteStatus } from '@/types/connect';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { FileText, Paperclip, Send, ShieldAlert, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react';
import { toast } from 'sonner';

const MAX_LENGTH = 2000;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set(['image/png', 'image/jpeg', 'application/pdf']);

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

type PendingAttachment = {
  file: File;
  previewUrl: string | null;
};

type MutateCallbacks = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
};

type ConnectComposerShellProps = {
  muteStatus?: ConnectMuteStatus;
  disabled: boolean;
  disabledReason?: string;
  isBusy: boolean;
  onSendMessage: (body: string, callbacks: MutateCallbacks) => void;
  onSendAttachment: (payload: { file: File; caption?: string }, callbacks: MutateCallbacks) => void;
};

export default function ConnectComposerShell({
  muteStatus,
  disabled,
  disabledReason,
  isBusy,
  onSendMessage,
  onSendAttachment,
}: ConnectComposerShellProps) {
  const [body, setBody] = useState('');
  const [pendingFile, setPendingFile] = useState<PendingAttachment | null>(null);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [muteTriggered, setMuteTriggered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const url = pendingFile?.previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [pendingFile?.previewUrl]);

  const isMuted = muteStatus ? muteStatus.muted : muteTriggered;

  const handleError = (error: unknown) => {
    if (isApiError(error)) {
      if (error.code === 'MESSAGE_BLOCKED_BY_FILTER') {
        setShowViolationModal(true);
        return;
      }
      if (error.code === 'CONNECT_MUTED') {
        setMuteTriggered(true);
      }
    }
    toast.error(getErrorMessage(error));
  };

  const stageFile = (file: File) => {
    if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
      toast.error('Only PNG, JPEG, or PDF attachments are supported.');
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      toast.error('File size must not exceed 5 MB.');
      return;
    }
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setPendingFile({ file, previewUrl });
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (isBusy) return;
    const trimmed = body.trim();
    if (pendingFile) {
      onSendAttachment(
        { file: pendingFile.file, caption: trimmed || undefined },
        {
          onSuccess: () => {
            setPendingFile(null);
            setBody('');
          },
          onError: handleError,
        },
      );
      return;
    }
    if (!trimmed) return;
    onSendMessage(trimmed, {
      onSuccess: () => setBody(''),
      onError: handleError,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    stageFile(file);
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const file = event.clipboardData?.files?.[0];
    if (!file) return;
    event.preventDefault();
    stageFile(file);
  };

  if (disabled || isMuted) {
    return (
      <div className="border-outline-variant border-t bg-white">
        {isMuted && (
          <div className="flex items-center gap-2 border-b border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
            <span>
              Your account has been temporarily restricted from sending messages due to community guideline violations.
            </span>
          </div>
        )}
        <div className="text-on-surface-variant px-5 py-3 text-center text-sm">
          {isMuted
            ? muteStatus?.expiresAt
              ? `Messaging restricted until ${formatDateTime(muteStatus.expiresAt)}.`
              : 'Messaging restricted. Please try again later.'
            : (disabledReason ?? 'You cannot send messages in this conversation.')}
        </div>
      </div>
    );
  }

  return (
    <>
      {pendingFile && (
        <div className="border-outline-variant flex items-center justify-between gap-3 border-t bg-slate-50/80 px-4 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            {pendingFile.previewUrl ? (
              <Image
                src={pendingFile.previewUrl}
                alt={pendingFile.file.name}
                width={44}
                height={44}
                unoptimized
                className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <FileText className="h-5 w-5 text-rose-500" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">{pendingFile.file.name}</p>
              <p className="text-[11px] text-slate-500">{formatFileSize(pendingFile.file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => setPendingFile(null)}
            aria-label="Remove attachment"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="border-outline-variant flex items-end gap-2.5 border-t bg-white px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={isBusy}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
          className="text-on-surface-variant hover:bg-surface-container-high flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:opacity-50"
        >
          <Paperclip className="h-4.5 w-4.5" />
        </button>

        <textarea
          ref={textareaRef}
          value={body}
          maxLength={MAX_LENGTH}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          rows={1}
          placeholder={pendingFile ? 'Add a caption (optional)...' : 'Type a message...'}
          className="border-outline-variant text-on-surface placeholder:text-outline max-h-32 min-h-10 flex-1 resize-none rounded-2xl border bg-white px-3.5 py-2.5 text-sm focus:outline-none"
        />

        <button
          type="button"
          disabled={isBusy || (!body.trim() && !pendingFile)}
          onClick={handleSend}
          aria-label="Send"
          className="bg-primary text-on-primary flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <ContentViolationWarningModal isOpen={showViolationModal} onClose={() => setShowViolationModal(false)} />
    </>
  );
}
