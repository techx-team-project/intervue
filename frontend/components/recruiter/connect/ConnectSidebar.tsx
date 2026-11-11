'use client';

import ConnectSettingsDropdown from '@/components/connect/ConnectSettingsDropdown';
import ConnectSidebarEmptyState from '@/components/connect/ConnectSidebarEmptyState';
import IntervueConnectLogo from '@/components/connect/IntervueConnectLogo';
import ConversationListItem from '@/components/recruiter/connect/ConversationListItem';
import Spinner from '@/components/common/Spinner';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/types/connect';
import { Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

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
  onOpenEligible?: () => void;
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
  onOpenEligible,
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
    <div
      className={cn(
        'border-outline-variant flex h-full w-full shrink-0 flex-col border-r bg-white md:w-[368px] lg:w-[356px] xl:w-[388px] 2xl:w-[404px]',
        selectedId !== null && 'hidden md:flex',
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
        <IntervueConnectLogo />
        <div className="flex shrink-0 items-center gap-1.5">
          {onOpenEligible && (
            <button
              type="button"
              onClick={onOpenEligible}
              title="Other Candidates"
              aria-label="Other Candidates"
              className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors lg:hidden"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
          <Link
            href={ROUTES.RECRUITER_DASHBOARD}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-slate-700 transition-colors hover:bg-slate-200/80"
          >
            Home
          </Link>
          <ConnectSettingsDropdown onOpenRules={onOpenRules} />
        </div>
      </div>

      <div className="px-4 pt-1 pb-3">
        <Input
          radius="full"
          focusTone="neutral"
          placeholder="Search candidate name..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9.5 bg-slate-50/70 text-[13px]"
        />
      </div>

      {/* Feedback Card (TopCV Image 2 style) */}
      <div className="px-4">
        <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
          <p className="text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">How is your experience with InterVue Connect?</span> Share
            your thoughts with our team to help us improve your experience.
          </p>
          <button
            type="button"
            onClick={() => toast.info('Thank you! Feedback feature is coming soon.')}
            className="mt-3 w-full cursor-pointer rounded-md bg-blue-50 py-2 text-[13.5px] font-semibold text-blue-600 transition-colors hover:bg-blue-100/80"
          >
            Send feedback
          </button>
        </div>
      </div>

      <div className="border-outline-variant mt-3 flex items-center gap-2 border-b px-4">
        {(['ALL', 'UNREAD'] as ConnectTab[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              '-mb-px cursor-pointer border-b-2 px-3 py-2.5 text-[15px] transition-colors sm:text-base',
              tab === value
                ? 'border-primary text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface border-transparent font-medium',
            )}
          >
            {value === 'ALL' ? 'All' : 'Unread'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <ConnectSidebarEmptyState
            mobileTitle="No conversations yet..."
            desktopTitle="No conversations yet"
            description={
              tab === 'UNREAD' ? 'No unread conversations.' : 'Conversations with candidates will appear here.'
            }
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
