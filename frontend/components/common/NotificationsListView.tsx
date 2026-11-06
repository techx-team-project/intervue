'use client';

import {
  NOTIFICATION_PAGE_SIZE,
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CATEGORY_LABELS_VI,
  RECRUITER_TAG_CLASSES,
  SEVERITY_TONE_CLASSES,
  isVietnameseRealm,
  notificationCopy,
  notificationTabLabel,
  notificationTabsFor,
} from '@/constants/notification';
import { useNotifications } from '@/hooks/useNotifications';
import { formatNotificationDate } from '@/utils/notification';
import type { NotificationRealm, NotificationSeverity } from '@/types/notification';
import { AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationsListViewProps {
  realm: NotificationRealm;
  baseRoute: string;
  pageTitle?: string;
}

export default function NotificationsListView({
  realm,
  baseRoute,
  pageTitle = 'System Notifications',
}: NotificationsListViewProps) {
  const router = useRouter();
  const {
    notifications,
    totalPages,
    page,
    setPage,
    activeCategory,
    setActiveCategory,
    unreadByCategory,
    unreadCount,
    isLoading,
    isError,
    refetch,
    markAsRead,
  } = useNotifications(realm, NOTIFICATION_PAGE_SIZE);

  const tabs = notificationTabsFor(realm);
  const copy = notificationCopy(realm);
  const vi = isVietnameseRealm(realm);

  const handleRowClick = (id: number) => {
    markAsRead(id);
    router.push(`${baseRoute}/${id}`);
  };

  const getTagClasses = (severity: NotificationSeverity) =>
    realm === 'recruiter' ? RECRUITER_TAG_CLASSES : SEVERITY_TONE_CLASSES[severity];

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="dark:text-forest-50 text-xl font-black text-slate-900 sm:text-2xl">{pageTitle}</h1>
      </div>

      <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab;
          const count = tab === 'ALL' ? unreadCount : (unreadByCategory[tab] ?? 0);

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#00b14f] text-white shadow-xs'
                  : 'dark:border-forest-800 dark:bg-forest-900 dark:text-forest-200 dark:hover:bg-forest-850 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{notificationTabLabel(tab, vi)}</span>
              {count > 0 && (
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {isLoading ? (
          <div className="dark:divide-forest-800 divide-y divide-slate-100">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center gap-6 p-4">
                <div className="dark:bg-forest-800 h-5 w-20 shrink-0 animate-pulse rounded-md bg-slate-100" />
                <div className="dark:bg-forest-800 h-4 w-20 shrink-0 animate-pulse rounded bg-slate-100" />
                <div className="dark:bg-forest-800 h-4 flex-1 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 stroke-[1.5] text-amber-500" />
            <p className="dark:text-forest-300 mt-3 text-sm font-semibold text-slate-600">{copy.loadError}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 cursor-pointer rounded-lg bg-[#00b14f] px-4 py-1.5 text-xs font-bold text-white transition hover:brightness-95"
            >
              {copy.retry}
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center">
            <Sparkles className="dark:text-forest-600 mx-auto h-10 w-10 stroke-[1.5] text-slate-300" />
            <p className="dark:text-forest-400 mt-3 text-sm font-semibold text-slate-500">{copy.empty}</p>
          </div>
        ) : (
          <div className="dark:divide-forest-800 divide-y divide-slate-100">
            {notifications.map((item) => {
              const isUnread = item.readAt === null;
              return (
                <div
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`flex cursor-pointer flex-col gap-2 p-4 transition sm:flex-row sm:items-center sm:gap-6 ${
                    isUnread
                      ? 'dark:bg-forest-850/60 dark:hover:bg-forest-800/60 bg-emerald-50/15 hover:bg-slate-50/80'
                      : 'dark:bg-forest-900 dark:hover:bg-forest-850/50 bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div className="shrink-0">
                    <span
                      className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getTagClasses(
                        item.severity,
                      )}`}
                    >
                      {realm === 'recruiter'
                        ? copy.tagFallback
                        : vi
                          ? NOTIFICATION_CATEGORY_LABELS_VI[item.category]
                          : NOTIFICATION_CATEGORY_LABELS[item.category]}
                    </span>
                  </div>

                  <div className="dark:text-forest-400 shrink-0 font-mono text-xs text-slate-500 sm:w-24">
                    {formatNotificationDate(item.createdAt)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-[13.5px] leading-snug sm:text-sm ${
                        isUnread
                          ? 'dark:text-forest-50 font-bold text-slate-900'
                          : 'dark:text-forest-200 font-medium text-slate-700'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  {isUnread && (
                    <div className="shrink-0">
                      <span className="rounded bg-[#00b14f] px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                        {copy.newBadge}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="dark:border-forest-800 dark:bg-forest-950/60 flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50/50 p-4">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(0)}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(Math.max(0, page - 1))}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index).map((pageNum) => {
              const isActive = page === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#00b14f] text-white shadow-xs'
                      : 'dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
