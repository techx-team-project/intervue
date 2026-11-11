import type { ConnectMessage } from '@/types/connect';

export const CONNECT_REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'] as const;
export const CONNECT_EDIT_WINDOW_MS = 15 * 60 * 1000;
const CLUSTER_GAP_MS = 5 * 60 * 1000;
const DIVIDER_GAP_MS = 20 * 60 * 1000;
const URL_REGEX = /https?:\/\/\S+/;

export function createClientMessageId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `cid-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function parseConnectRouteId(raw: string | string[] | undefined): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function extractFirstHttpUrl(text: string): string | null {
  if (!text) return null;
  const match = text.match(URL_REGEX);
  if (!match) return null;
  const cleaned = match[0].replace(/[.,;:!?)]+$/, '');
  try {
    const parsed = new URL(cleaned);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? cleaned : null;
  } catch {
    return null;
  }
}

export function canEditConnectMessage(
  message: ConnectMessage,
  isOwnSender: boolean,
  nowMs: number = Date.now(),
): boolean {
  if (!isOwnSender || message.recalled || message.optimisticStatus) return false;
  if (message.messageType !== 'TEXT' && message.messageType !== 'LINK') return false;
  const createdMs = new Date(message.createdAt).getTime();
  if (Number.isNaN(createdMs)) return false;
  return nowMs - createdMs <= CONNECT_EDIT_WINDOW_MS;
}

export function getMessagePreviewText(message: ConnectMessage): string {
  if (message.recalled) return 'Message unsent';
  if (message.messageType === 'IMAGE') return 'Sent an image';
  if (message.messageType === 'FILE') return 'Sent an attachment';
  if (message.messageType === 'LINK') {
    return message.linkTitle || message.body?.slice(0, 80) || 'Shared a link';
  }
  return (message.body ?? '').slice(0, 80);
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatConnectDividerTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (sameCalendarDay(date, now)) {
    return `Today, ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameCalendarDay(date, yesterday)) {
    return `Yesterday, ${timeStr}`;
  }

  const sameYear = date.getFullYear() === now.getFullYear();
  const dayStr = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  return `${dayStr}, ${timeStr}`;
}

export function formatConnectExactTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function shouldShowTimelineDivider(prev: ConnectMessage | undefined, current: ConnectMessage): boolean {
  if (!prev) return true;
  const prevDate = new Date(prev.createdAt);
  const currDate = new Date(current.createdAt);
  if (Number.isNaN(prevDate.getTime()) || Number.isNaN(currDate.getTime())) return false;
  if (!sameCalendarDay(prevDate, currDate)) return true;
  return currDate.getTime() - prevDate.getTime() >= DIVIDER_GAP_MS;
}

export function isSameSender(a: ConnectMessage, b: ConnectMessage): boolean {
  return a.senderType === b.senderType && a.senderId === b.senderId;
}

export function isClusteredWithPrev(prev: ConnectMessage | undefined, current: ConnectMessage): boolean {
  if (!prev || shouldShowTimelineDivider(prev, current)) return false;
  if (!isSameSender(prev, current)) return false;
  return new Date(current.createdAt).getTime() - new Date(prev.createdAt).getTime() <= CLUSTER_GAP_MS;
}

export function isClusteredWithNext(current: ConnectMessage, next: ConnectMessage | undefined): boolean {
  if (!next || shouldShowTimelineDivider(current, next)) return false;
  if (!isSameSender(current, next)) return false;
  return new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime() <= CLUSTER_GAP_MS;
}

export function formatConnectFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function triggerConnectBlobDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
