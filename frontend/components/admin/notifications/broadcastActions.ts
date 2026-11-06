import type { BroadcastStatus } from '@/types/notification';

export interface BroadcastCapabilities {
  canEdit: boolean;
  canSend: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canDuplicate: boolean;
}

const PENDING: BroadcastStatus[] = ['DRAFT', 'SCHEDULED'];

export function broadcastCapabilities(status: BroadcastStatus): BroadcastCapabilities {
  const pending = PENDING.includes(status);
  return {
    canEdit: pending,
    canSend: pending,
    canCancel: pending,
    canDelete: status === 'DRAFT' || status === 'CANCELLED',
    canDuplicate: true,
  };
}

export const BROADCAST_STATUS_STYLES: Record<BroadcastStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-600 dark:bg-forest-800 dark:text-forest-300',
  SCHEDULED: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  SENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  SENT: 'bg-emerald-50 text-[#00b14f] dark:bg-emerald-950/40 dark:text-emerald-300',
  CANCELLED: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

export function formatBroadcastDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatBroadcastDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
