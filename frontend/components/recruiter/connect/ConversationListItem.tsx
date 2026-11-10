import UserAvatar from '@/components/ui/UserAvatar';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/types/connect';
import { formatRelativeDay } from '@/utils/datetime';

type ConversationListItemProps = {
  conversation: ConversationSummary;
  isActive: boolean;
  onClick: () => void;
};

const STATUS_LABEL: Record<ConversationSummary['status'], string> = {
  PENDING: 'Đang chờ chấp nhận',
  ACCEPTED: '',
  DECLINED: 'Đã từ chối',
  BLOCKED: 'Đã chặn',
};

export default function ConversationListItem({ conversation, isActive, onClick }: ConversationListItemProps) {
  const statusLabel = STATUS_LABEL[conversation.status];
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
        isActive ? 'bg-primary-light' : 'hover:bg-surface-container-low',
      )}
    >
      <UserAvatar fullName={conversation.candidateName} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-body-md truncate',
              hasUnread ? 'text-on-surface font-bold' : 'text-on-surface font-semibold',
            )}
          >
            {conversation.candidateName}
          </p>
          {conversation.lastMessageAt && (
            <span className="text-label-sm text-on-surface-variant shrink-0">
              {formatRelativeDay(conversation.lastMessageAt)}
            </span>
          )}
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={cn('truncate text-xs', hasUnread ? 'text-on-surface font-semibold' : 'text-on-surface-variant')}
          >
            {statusLabel || conversation.lastMessagePreview || 'Chưa có tin nhắn'}
          </p>
          {hasUnread && (
            <span className="text-label-sm flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-[#e03e2d] px-1 font-bold text-white">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
