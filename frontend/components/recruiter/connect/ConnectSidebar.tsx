'use client';

import CatEmptyIllustration from '@/components/connect/CatEmptyIllustration';
import ConnectSettingsDropdown from '@/components/connect/ConnectSettingsDropdown';
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
        'border-outline-variant flex h-full w-full flex-col border-r bg-white md:w-80',
        selectedId !== null && 'hidden md:flex',
      )}
    >
      <div className="border-outline-variant flex items-center justify-between gap-2 border-b px-4 py-3.5">
        <IntervueConnectLogo />
        <div className="flex items-center gap-1">
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
            className="text-body-sm text-on-surface-variant hover:bg-surface-container-low rounded-full px-2.5 py-1.5 font-semibold transition-colors"
          >
            Home
          </Link>
          <ConnectSettingsDropdown onOpenRules={onOpenRules} />
        </div>
      </div>

      <div className="px-4 pt-3">
        <Input
          placeholder="Search candidate name..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Feedback Card (TopCV Image 2 style) */}
      <div className="px-4 pt-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <p className="text-xs font-semibold text-slate-800">How is your experience with InterVue Connect?</p>
          <p className="mt-1 text-[11px] leading-tight text-slate-500">
            Share your thoughts with our team to help us improve your experience.
          </p>
          <button
            type="button"
            onClick={() => toast.info('Thank you! Feedback feature is coming soon.')}
            className="mt-2.5 w-full cursor-pointer rounded-lg bg-blue-50 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
          >
            Send feedback
          </button>
        </div>
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
          <div className="py-12">
            <CatEmptyIllustration
              title="You don't have any conversations..."
              description={tab === 'UNREAD' ? 'No unread conversations.' : undefined}
            />
          </div>
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
