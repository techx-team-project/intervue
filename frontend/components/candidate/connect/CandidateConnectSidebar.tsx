'use client';

import CandidateConversationListItem from '@/components/candidate/connect/CandidateConversationListItem';
import CandidateInvitationListItem from '@/components/candidate/connect/CandidateInvitationListItem';
import CatEmptyIllustration from '@/components/connect/CatEmptyIllustration';
import ConnectSettingsDropdown from '@/components/connect/ConnectSettingsDropdown';
import IntervueConnectLogo from '@/components/connect/IntervueConnectLogo';
import Spinner from '@/components/common/Spinner';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/types/connect';
import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export type CandidateConnectTab = 'ALL' | 'INVITATIONS';

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

  const filteredConversations = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (!term) return true;
      return (
        conversation.companyName.toLowerCase().includes(term) ||
        (conversation.lastMessagePreview?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [conversations, debouncedSearch]);

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

  const activeList = selectedTab === 'ALL' ? filteredConversations : filteredInvitations;
  const isLoading = selectedTab === 'ALL' ? isLoadingConversations : isLoadingInvitations;

  return (
    <div className="border-outline-variant flex h-full w-full flex-col border-r bg-white sm:w-80">
      {/* Top Header of Sidebar */}
      <div className="border-outline-variant flex items-center justify-between gap-2 border-b px-4 py-3.5">
        <IntervueConnectLogo />
        <div className="flex items-center gap-1">
          <Link
            href={ROUTES.HOME}
            className="text-body-sm text-on-surface-variant hover:bg-surface-container-low rounded-full px-2.5 py-1.5 font-semibold transition-colors"
          >
            Home
          </Link>
          <ConnectSettingsDropdown onOpenRules={onOpenRules} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-3">
        <Input
          placeholder="Search company, recruiter..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Promo Banner Card (Image 3 style) */}
      <div className="px-4 pt-3">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-3 text-white shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="rounded-lg bg-white/20 p-1.5">
              <Sparkles className="h-4 w-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs font-bold">InterVue Connect</p>
              <p className="mt-0.5 text-[11px] leading-tight text-emerald-100">
                Chat directly with recruiters and schedule interviews faster.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-outline-variant mt-3 flex items-center gap-5 border-b px-4">
        <button
          type="button"
          onClick={() => onSelectTab('ALL')}
          className={cn(
            'text-body-md -mb-px flex items-center gap-1.5 border-b-2 px-0.5 py-2.5 font-semibold transition-colors',
            selectedTab === 'ALL'
              ? 'border-primary text-primary'
              : 'text-on-surface-variant hover:text-on-surface border-transparent',
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
          onClick={() => onSelectTab('INVITATIONS')}
          className={cn(
            'text-body-md -mb-px flex items-center gap-1.5 border-b-2 px-0.5 py-2.5 font-semibold transition-colors',
            selectedTab === 'INVITATIONS'
              ? 'border-primary text-primary'
              : 'text-on-surface-variant hover:text-on-surface border-transparent',
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
          <div className="py-12">
            <CatEmptyIllustration
              title={selectedTab === 'ALL' ? 'No conversations yet...' : 'No invitations yet...'}
              description={
                selectedTab === 'ALL'
                  ? 'Companies you connect with will appear here.'
                  : 'Chat invitations from recruiters will arrive here.'
              }
            />
          </div>
        ) : (
          <div className="space-y-1">
            {selectedTab === 'ALL'
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

            {selectedTab === 'ALL' && <div ref={sentinelRef} />}
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
