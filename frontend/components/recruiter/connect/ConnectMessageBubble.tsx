'use client';

import { recruiterConnectApi } from '@/apiRequest/recruiter-connect';
import { cn } from '@/lib/utils';
import type { ConnectMessage } from '@/types/connect';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { FileText, Download } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

type ConnectMessageBubbleProps = {
  message: ConnectMessage;
  isOwn: boolean;
};

function isRedacted(message: ConnectMessage): boolean {
  return !message.body && !message.attachmentUrl && !message.attachmentFileName && !message.linkUrl;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function downloadFile(message: ConnectMessage) {
  try {
    const blob = await recruiterConnectApi.downloadAttachment(message.connectionId, message.id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = message.attachmentFileName ?? 'tep-dinh-kem';
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
}

export default function ConnectMessageBubble({ message, isOwn }: ConnectMessageBubbleProps) {
  const redacted = isRedacted(message);

  return (
    <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm break-words',
          isOwn ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface',
          redacted && 'italic opacity-70',
        )}
      >
        {redacted ? (
          <p>Nội dung đã được quản trị viên ẩn</p>
        ) : message.messageType === 'IMAGE' && message.attachmentUrl ? (
          <Image
            src={message.attachmentUrl}
            alt={message.attachmentFileName ?? 'Hình ảnh'}
            width={280}
            height={200}
            className="max-h-72 w-full rounded-lg object-cover"
          />
        ) : message.messageType === 'FILE' ? (
          <button type="button" onClick={() => downloadFile(message)} className="flex items-center gap-2.5 text-left">
            <FileText className="h-8 w-8 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{message.attachmentFileName}</span>
              <span className="text-xs opacity-80">{formatFileSize(message.attachmentFileSizeBytes)}</span>
            </span>
            <Download className="h-4 w-4 shrink-0" />
          </button>
        ) : (
          <div className="space-y-2">
            <p className="whitespace-pre-wrap">{message.body}</p>
            {message.messageType === 'LINK' && message.linkUrl && (
              <a
                href={message.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-outline-variant text-on-surface block overflow-hidden rounded-lg border bg-white"
              >
                {message.linkImageUrl && (
                  <Image
                    src={message.linkImageUrl}
                    alt={message.linkTitle ?? message.linkUrl}
                    width={280}
                    height={140}
                    className="h-28 w-full object-cover"
                  />
                )}
                <span className="block px-2.5 py-2">
                  <span className="block truncate text-sm font-semibold">{message.linkTitle ?? message.linkUrl}</span>
                  {message.linkDescription && (
                    <span className="text-on-surface-variant block truncate text-xs">{message.linkDescription}</span>
                  )}
                </span>
              </a>
            )}
          </div>
        )}
      </div>
      <span className="text-label-sm text-on-surface-variant mt-1">{formatDateTime(message.createdAt)}</span>
    </div>
  );
}
