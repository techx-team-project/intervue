'use client';

import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationCategory, NotificationTarget } from '@/types/notification';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface NotificationsListViewProps {
  target: NotificationTarget;
  baseRoute: string; // e.g. '/recruiter/notifications' or '/admin/notifications'
  pageTitle?: string;
}

const ITEMS_PER_PAGE = 10;

const CATEGORY_TABS: { key: NotificationCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'system', label: 'System' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'applications', label: 'Applications' },
  { key: 'connections', label: 'Connect' },
];

export default function NotificationsListView({
  target,
  baseRoute,
  pageTitle = 'System Notifications',
}: NotificationsListViewProps) {
  const router = useRouter();
  const { notifications, filteredNotifications, activeCategory, setActiveCategory, markAsRead } =
    useNotifications(target);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));

  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNotifications, currentPage]);

  const handleRowClick = (id: string) => {
    markAsRead(id);
    router.push(`${baseRoute}/${id}`);
  };

  const getTagClasses = (tone?: string) => {
    if (target === 'recruiter') {
      // Recruiter Panel: all badges use the exact same soft yellow pill style as TopCV
      return 'bg-amber-50 text-amber-800 border-amber-200/90';
    }

    // Admin Panel: supports color-coded tones and dark mode
    switch (tone) {
      case 'danger':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60';
      case 'warning':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60';
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="dark:text-forest-50 text-xl font-black text-slate-900 sm:text-2xl">{pageTitle}</h1>
      </div>

      {/* Category Navbar */}
      <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.key;
          const count =
            tab.key === 'all' ? notifications.length : notifications.filter((n) => n.category === tab.key).length;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveCategory(tab.key);
                setCurrentPage(1);
              }}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#00b14f] text-white shadow-xs'
                  : 'dark:border-forest-800 dark:bg-forest-900 dark:text-forest-200 dark:hover:bg-forest-850 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'dark:bg-forest-800 dark:text-forest-300 bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Notification Card Table */}
      <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {paginatedNotifications.length === 0 ? (
          <div className="py-20 text-center">
            <Sparkles className="dark:text-forest-600 mx-auto h-10 w-10 stroke-[1.5] text-slate-300" />
            <p className="dark:text-forest-400 mt-3 text-sm font-semibold text-slate-500">
              No notifications found in this category
            </p>
          </div>
        ) : (
          <div className="dark:divide-forest-800 divide-y divide-slate-100">
            {paginatedNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRowClick(item.id)}
                className={`flex cursor-pointer flex-col gap-2 p-4 transition sm:flex-row sm:items-center sm:gap-6 ${
                  !item.isRead
                    ? 'dark:bg-forest-850/60 dark:hover:bg-forest-800/60 bg-emerald-50/15 hover:bg-slate-50/80'
                    : 'dark:bg-forest-900 dark:hover:bg-forest-850/50 bg-white hover:bg-slate-50/80'
                }`}
              >
                {/* Category Pill Tag */}
                <div className="shrink-0">
                  <span
                    className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getTagClasses(
                      item.tagTone,
                    )}`}
                  >
                    {target === 'recruiter' ? 'Notification' : item.tag}
                  </span>
                </div>

                {/* Display Date */}
                <div className="dark:text-forest-400 shrink-0 font-mono text-xs text-slate-500 sm:w-24">
                  {item.displayDate}
                </div>

                {/* Subject / Title */}
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-[13.5px] leading-snug sm:text-sm ${
                      !item.isRead
                        ? 'dark:text-forest-50 font-bold text-slate-900'
                        : 'dark:text-forest-200 font-medium text-slate-700'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                {/* Unread "New" badge */}
                {!item.isRead && (
                  <div className="shrink-0">
                    <span className="rounded bg-[#00b14f] px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                      New
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar (Image 2) */}
        {totalPages > 1 && (
          <div className="dark:border-forest-800 dark:bg-forest-950/60 flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50/50 p-4">
            {/* First page */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Prev page */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#00b14f] text-white shadow-xs'
                      : 'dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next page */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last page */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
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
