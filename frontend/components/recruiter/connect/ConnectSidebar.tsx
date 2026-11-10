'use client';

import ConversationListItem from '@/components/recruiter/connect/ConversationListItem';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/types/connect';
import { MessagesSquare, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type ConnectTab = 'ALL' | 'UNREAD';

type ConnectSidebarProps = {
  conversations: ConversationSummary[];
  isLoading: boolean;
  hasMore?: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onOpenRules: () => void;
};

export default function ConnectSidebar({
  conversations,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  selectedId,
  onSelect,
  onOpenRules,
}: ConnectSidebarProps) {
  const [tab, setTab] = useState<ConnectTab>('ALL');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { ref: sentinelRef, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (tab === 'UNREAD' && conversation.unreadCount === 0) return false;
      if (term && !conversation.candidateName.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [conversations, tab, debouncedSearch]);

  return (
    <div className="border-outline-variant flex h-full w-full flex-col border-r bg-white sm:w-80">
      <div className="border-outline-variant flex items-center justify-between gap-2 border-b px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className="text-title-md text-on-surface font-bold">InterVue Connect</span>
          <span className="text-label-sm bg-primary-light text-primary rounded-full px-1.5 py-0.5 font-bold">Beta</span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={ROUTES.RECRUITER_DASHBOARD}
            className="text-body-sm text-on-surface-variant hover:bg-surface-container-low rounded-full px-2.5 py-1.5 font-semibold transition-colors"
          >
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={onOpenRules}
            title="Quy định sử dụng"
            aria-label="Quy định sử dụng"
            className="text-on-surface-variant hover:bg-surface-container-low flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-3">
        <Input
          placeholder="Họ tên ứng viên..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="border-outline-variant mt-3 flex items-center gap-5 border-b px-4">
        {(['ALL', 'UNREAD'] as ConnectTab[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              'text-body-md -mb-px border-b-2 px-0.5 py-2.5 font-semibold transition-colors',
              tab === value
                ? 'border-primary text-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent',
            )}
          >
            {value === 'ALL' ? 'Tất cả' : 'Chưa đọc'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={MessagesSquare}
            title="Bạn không có cuộc trò chuyện nào..."
            description={tab === 'UNREAD' ? 'Không có hội thoại chưa đọc.' : undefined}
            className="mt-6 border-none"
          />
        ) : (
          <div className="space-y-1">
            {filtered.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === selectedId}
                onClick={() => onSelect(conversation.id)}
              />
            ))}
            <div ref={sentinelRef} />
            {isLoadingMore && (
              <div className="flex justify-center py-3">
                <Spinner />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
