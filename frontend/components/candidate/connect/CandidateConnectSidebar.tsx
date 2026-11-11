'use client';

import CandidateConversationListItem from '@/components/candidate/connect/CandidateConversationListItem';
import CandidateInvitationListItem from '@/components/candidate/connect/CandidateInvitationListItem';
import ConnectSettingsDropdown from '@/components/connect/ConnectSettingsDropdown';
import ConnectSidebarEmptyState from '@/components/connect/ConnectSidebarEmptyState';
import IntervueConnectLogo from '@/components/connect/IntervueConnectLogo';
import Spinner from '@/components/common/Spinner';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/types/connect';
import { MessageCircleMore, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export type CandidateConnectTab = 'ALL' | 'UNREAD' | 'INVITATIONS';

type CandidateConnectSidebarProps = {
  conversations: ConversationSummary[];
  invitations: ConversationSummary[];
  isLoadingConversations: boolean;
  isLoadingInvitations: boolean;
  hasMoreConversations?: boolean;
  isLoadingMoreConversations: boolean;
  onLoadMoreConversations: () => void;
  selectedId: number | null;
  selectedTab: CandidateConnectTab;
  onSelectTab: (tab: CandidateConnectTab) => void;
  onSelectConversation: (id: number) => void;
  onOpenRules: () => void;
};

export default function CandidateConnectSidebar({
  conversations,
  invitations,
  isLoadingConversations,
  isLoadingInvitations,
  hasMoreConversations,
  isLoadingMoreConversations,
  onLoadMoreConversations,
  selectedId,
  selectedTab,
  onSelectTab,
  onSelectConversation,
  onOpenRules,
}: CandidateConnectSidebarProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { ref: sentinelRef, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (inView && hasMoreConversations && !isLoadingMoreConversations && selectedTab === 'ALL') {
      onLoadMoreConversations();
    }
  }, [inView, hasMoreConversations, isLoadingMoreConversations, onLoadMoreConversations, selectedTab]);

  const unreadCountTotal = useMemo(() => conversations.filter((c) => c.unreadCount > 0).length, [conversations]);

  const filteredConversations = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (selectedTab === 'UNREAD' && conversation.unreadCount === 0) return false;
      if (!term) return true;
      return (
        conversation.companyName.toLowerCase().includes(term) ||
        (conversation.lastMessagePreview?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [conversations, selectedTab, debouncedSearch]);

  const filteredInvitations = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return invitations.filter((invitation) => {
      if (!term) return true;
      return (
        invitation.companyName.toLowerCase().includes(term) ||
        (invitation.lastMessagePreview?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [invitations, debouncedSearch]);

  const activeList = selectedTab === 'INVITATIONS' ? filteredInvitations : filteredConversations;
  const isLoading = selectedTab === 'INVITATIONS' ? isLoadingInvitations : isLoadingConversations;

  return (
    <div
      className={cn(
        'border-outline-variant flex h-full w-full shrink-0 flex-col border-r bg-white md:w-[368px] lg:w-[356px] xl:w-[388px] 2xl:w-[404px]',
        selectedId !== null && 'hidden md:flex',
      )}
    >
      {/* Top Header of Sidebar */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
        <IntervueConnectLogo />
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href={ROUTES.HOME}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-slate-700 transition-colors hover:bg-slate-200/80"
          >
            Home
          </Link>
          <ConnectSettingsDropdown onOpenRules={onOpenRules} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-1 pb-3">
        <Input
          radius="full"
          focusTone="neutral"
          placeholder="Search company, recruiter..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9.5 bg-slate-50/70 text-[13px]"
        />
      </div>

      {/* Connect Info Card */}
      <div className="px-4">
        <div className="rounded-lg border border-emerald-200/80 bg-gradient-to-br from-emerald-50/85 via-white to-teal-50/40 p-4 shadow-[0_2px_10px_rgba(16,185,129,0.06)]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">InterVue Connect</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                Chat directly with recruiters and schedule interviews faster.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-outline-variant mt-3 flex items-center gap-3 border-b px-4 sm:gap-4">
        <button
          type="button"
          onClick={() => onSelectTab('ALL')}
          className={cn(
            '-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-1.5 py-2.5 text-[15px] transition-colors sm:text-base',
            selectedTab === 'ALL'
              ? 'border-primary text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface border-transparent font-medium',
          )}
        >
          <span>All</span>
          {conversations.length > 0 && (
            <span className="py-0.2 rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600">
              {conversations.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('UNREAD')}
          className={cn(
            '-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-1.5 py-2.5 text-[15px] transition-colors sm:text-base',
            selectedTab === 'UNREAD'
              ? 'border-primary text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface border-transparent font-medium',
          )}
        >
          <span>Unread</span>
          {unreadCountTotal > 0 && (
            <span className="py-0.2 rounded-full bg-[#e03e2d] px-1.5 text-xs font-bold text-white">
              {unreadCountTotal}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('INVITATIONS')}
          className={cn(
            '-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-1.5 py-2.5 text-[15px] transition-colors sm:text-base',
            selectedTab === 'INVITATIONS'
              ? 'border-primary text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface border-transparent font-medium',
          )}
        >
          <span>Invitations</span>
          {invitations.length > 0 && (
            <span className="py-0.2 rounded-full bg-emerald-500 px-1.5 text-xs font-bold text-white">
              {invitations.length}
            </span>
          )}
        </button>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : activeList.length === 0 ? (
          <ConnectSidebarEmptyState
            mobileTitle={
              selectedTab === 'INVITATIONS'
                ? 'No invitations yet...'
                : selectedTab === 'UNREAD'
                  ? 'No unread conversations'
                  : 'No conversations yet...'
            }
            desktopTitle={
              selectedTab === 'INVITATIONS'
                ? 'No invitations yet'
                : selectedTab === 'UNREAD'
                  ? 'No unread conversations'
                  : 'No conversations yet'
            }
            description={
              selectedTab === 'INVITATIONS'
                ? 'Chat invitations from recruiters will arrive here.'
                : selectedTab === 'UNREAD'
                  ? 'All conversations have been read.'
                  : 'Companies you connect with will appear here.'
            }
          />
        ) : (
          <div className="space-y-1">
            {selectedTab !== 'INVITATIONS'
              ? activeList.map((conversation) => (
                  <CandidateConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={conversation.id === selectedId}
                    onClick={() => onSelectConversation(conversation.id)}
                  />
                ))
              : activeList.map((invitation) => (
                  <CandidateInvitationListItem
                    key={invitation.id}
                    invitation={invitation}
                    isActive={invitation.id === selectedId}
                    onClick={() => onSelectConversation(invitation.id)}
                  />
                ))}

            {selectedTab !== 'INVITATIONS' && <div ref={sentinelRef} />}
            {isLoadingMoreConversations && (
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
