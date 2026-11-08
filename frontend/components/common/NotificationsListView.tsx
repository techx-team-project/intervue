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
        <h1 className="dark:text-forest-50 text-on-surface text-xl font-bold sm:text-2xl">{pageTitle}</h1>
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
                  ? 'bg-primary text-white shadow-xs'
                  : 'dark:border-forest-800 dark:bg-forest-900 dark:text-forest-200 dark:hover:bg-forest-850 border-outline-variant text-on-surface-variant hover:bg-surface-container-low border bg-white'
              }`}
            >
              <span>{notificationTabLabel(tab, vi)}</span>
              {count > 0 && (
                <span
                  className={`py-0.2 text-label-sm rounded-full px-1.5 font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'dark:bg-forest-800 dark:text-forest-300 bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant overflow-hidden rounded-xl border bg-white shadow-xs">
        {isLoading ? (
          <div className="dark:divide-forest-800 divide-outline-variant divide-y">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center gap-6 p-4">
                <div className="dark:bg-forest-800 bg-surface-container-high h-5 w-20 shrink-0 animate-pulse rounded-md" />
                <div className="dark:bg-forest-800 bg-surface-container-high h-4 w-20 shrink-0 animate-pulse rounded" />
                <div className="dark:bg-forest-800 bg-surface-container-high h-4 flex-1 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 stroke-[1.5] text-amber-500" />
            <p className="dark:text-forest-300 text-on-surface-variant mt-3 text-sm font-semibold">{copy.loadError}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-primary mt-3 cursor-pointer rounded-lg px-4 py-1.5 text-xs font-bold text-white transition hover:brightness-95"
            >
              {copy.retry}
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center">
            <Sparkles className="dark:text-forest-600 text-outline mx-auto h-10 w-10 stroke-[1.5]" />
            <p className="dark:text-forest-400 text-on-surface-variant mt-3 text-sm font-semibold">{copy.empty}</p>
          </div>
        ) : (
          <div className="dark:divide-forest-800 divide-outline-variant divide-y">
            {notifications.map((item) => {
              const isUnread = item.readAt === null;
              return (
                <div
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`flex cursor-pointer flex-col gap-2 p-4 transition sm:flex-row sm:items-center sm:gap-6 ${
                    isUnread
                      ? 'dark:bg-forest-850/60 dark:hover:bg-forest-800/60 hover:bg-surface-container-low/80 bg-emerald-50/15'
                      : 'dark:bg-forest-900 dark:hover:bg-forest-850/50 hover:bg-surface-container-low/80 bg-white'
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

                  <div className="dark:text-forest-400 text-on-surface-variant shrink-0 font-mono text-xs sm:w-24">
                    {formatNotificationDate(item.createdAt)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-body-md leading-snug sm:text-sm ${
                        isUnread
                          ? 'dark:text-forest-50 text-on-surface font-bold'
                          : 'dark:text-forest-200 text-on-surface font-medium'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  {isUnread && (
                    <div className="shrink-0">
                      <span className="bg-primary text-label-sm rounded px-2 py-0.5 font-bold text-white shadow-2xs">
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
          <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/50 flex items-center justify-center gap-1.5 border-t p-4">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(0)}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 border-outline-variant text-on-surface-variant hover:bg-surface-container-high flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(Math.max(0, page - 1))}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 border-outline-variant text-on-surface-variant hover:bg-surface-container-high flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition disabled:cursor-not-allowed disabled:opacity-40"
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
                      ? 'bg-primary text-white shadow-xs'
                      : 'dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 border-outline-variant text-on-surface hover:bg-surface-container-high border bg-white'
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
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 border-outline-variant text-on-surface-variant hover:bg-surface-container-high flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 border-outline-variant text-on-surface-variant hover:bg-surface-container-high flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition disabled:cursor-not-allowed disabled:opacity-40"
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
