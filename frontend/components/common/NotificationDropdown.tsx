'use client';

import {
  isVietnameseRealm,
  notificationCopy,
  notificationTabLabel,
  notificationTabsFor,
} from '@/constants/notification';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationRealm } from '@/types/notification';
import { formatNotificationDate, groupByDate } from '@/utils/notification';
import { AlertTriangle, ArrowRight, CheckCheck, Filter, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface NotificationDropdownProps {
  realm: NotificationRealm;
  baseRoute: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

type TimeRangeOption = '7days' | '30days' | '60days' | 'custom';

const PRESET_DAYS: Record<Exclude<TimeRangeOption, 'custom'>, number> = {
  '7days': 7,
  '30days': 30,
  '60days': 60,
};

const DROPDOWN_PAGE_SIZE = 20;

export default function NotificationDropdown({
  realm,
  baseRoute,
  isOpen,
  onClose,
  className,
}: NotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const [selectedTimeOption, setSelectedTimeOption] = useState<TimeRangeOption | null>(null);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const {
    notifications,
    activeCategory,
    setActiveCategory,
    timeRange,
    setTimeRange,
    markAsRead,
    markAllAsRead,
    markAllSeen,
    isLoading,
    isError,
    refetch,
  } = useNotifications(realm, DROPDOWN_PAGE_SIZE);

  useEffect(() => {
    if (!isOpen) return;
    markAllSeen();
  }, [isOpen, markAllSeen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = notificationTabsFor(realm);
  const copy = notificationCopy(realm);
  const vi = isVietnameseRealm(realm);
  const isFilterActive = Boolean(timeRange.from || timeRange.to);

  const handleItemClick = (id: number) => {
    markAsRead(id);
    onClose();
    router.push(`${baseRoute}/${id}`);
  };

  const handleApplyTimeFilter = () => {
    if (selectedTimeOption === 'custom') {
      setTimeRange({
        from: customFrom ? new Date(`${customFrom}T00:00:00`).toISOString() : undefined,
        to: customTo ? new Date(`${customTo}T23:59:59`).toISOString() : undefined,
      });
    } else if (selectedTimeOption) {
      const since = new Date();
      since.setDate(since.getDate() - PRESET_DAYS[selectedTimeOption]);
      setTimeRange({ from: since.toISOString() });
    }
    setIsTimeFilterOpen(false);
  };

  const handleResetTimeFilter = () => {
    setSelectedTimeOption(null);
    setCustomFrom('');
    setCustomTo('');
    setTimeRange({});
    setIsTimeFilterOpen(false);
  };

  const grouped = groupByDate(notifications);

  return (
    <div
      ref={dropdownRef}
      className={`dark:border-forest-800 dark:bg-forest-900 animate-in fade-in-0 zoom-in-95 absolute top-full right-0 z-50 mt-2.5 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 duration-150 sm:w-[420px] dark:ring-white/5 ${
        className || ''
      }`}
    >
      <div className="dark:border-forest-800 dark:bg-forest-900 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5">
        <h3 className="dark:text-forest-50 text-base font-bold text-slate-900">Notifications</h3>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsTimeFilterOpen((prev) => !prev)}
            title="Filter by time"
            aria-label="Filter by time"
            className={`rounded-full p-1.5 transition ${
              isTimeFilterOpen || isFilterActive
                ? 'border border-emerald-200 bg-emerald-50 text-[#00b14f] dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'dark:text-forest-400 dark:hover:bg-forest-850 dark:hover:text-forest-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => markAllAsRead()}
            title="Mark all as read"
            aria-label="Mark all as read"
            className="dark:text-forest-400 dark:hover:bg-forest-850 flex items-center gap-1 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-[#00b14f] dark:hover:text-emerald-400"
          >
            <CheckCheck className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isTimeFilterOpen && (
        <div className="dark:border-forest-800 dark:bg-forest-900 animate-in fade-in-0 slide-in-from-top-2 border-b border-slate-100 bg-white p-4 duration-150">
          <p className="dark:text-forest-100 text-xs font-bold text-slate-900 sm:text-sm">Filter by time</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { key: '7days', label: 'Last 7 days' },
              { key: '30days', label: 'Last 30 days' },
              { key: '60days', label: 'Last 60 days' },
              { key: 'custom', label: 'Custom date range' },
            ].map((chip) => {
              const isSelected = selectedTimeOption === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setSelectedTimeOption(isSelected ? null : (chip.key as TimeRangeOption))}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    isSelected
                      ? 'border border-[#00b14f] bg-[#e6f7ee] font-semibold text-[#00b14f] dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {selectedTimeOption === 'custom' && (
            <div className="mt-3 flex items-center gap-2 pt-1 text-xs">
              <div className="flex-1">
                <label className="dark:text-forest-400 mb-1 block text-[11px] font-semibold text-slate-500">
                  From:
                </label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(event) => setCustomFrom(event.target.value)}
                  className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-100 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="dark:text-forest-400 mb-1 block text-[11px] font-semibold text-slate-500">To:</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(event) => setCustomTo(event.target.value)}
                  className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-100 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleResetTimeFilter}
              className="dark:border-forest-800 dark:text-forest-300 dark:hover:bg-forest-800 cursor-pointer rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              disabled={!selectedTimeOption}
              onClick={handleApplyTimeFilter}
              className="cursor-pointer rounded-full bg-[#00b14f] px-5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#00873c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="dark:border-forest-800 dark:bg-forest-950/60 flex scrollbar-none items-center gap-1.5 overflow-x-auto border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#00b14f] text-white shadow-2xs'
                  : 'dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 dark:border-forest-800 border border-slate-200 bg-white text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {notificationTabLabel(tab, vi)}
            </button>
          );
        })}
      </div>

      <div className="dark:divide-forest-800 max-h-[380px] divide-y divide-slate-100 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="dark:bg-forest-800 h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="dark:bg-forest-800 h-3.5 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="dark:bg-forest-800 h-3 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 stroke-[1.5] text-amber-500" />
            <p className="dark:text-forest-300 mt-2 text-xs font-semibold text-slate-600">{copy.loadError}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00b14f] hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{copy.retry}</span>
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Sparkles className="dark:text-forest-600 mx-auto h-8 w-8 stroke-[1.5] text-slate-300" />
            <p className="dark:text-forest-400 mt-2 text-xs font-semibold text-slate-500">{copy.emptyFiltered}</p>
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetTimeFilter}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00b14f] hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{copy.clearTimeFilter}</span>
              </button>
            )}
          </div>
        ) : (
          grouped.map(([dateGroup, itemsInDate]) => (
            <div key={dateGroup}>
              <div className="dark:bg-forest-950/90 dark:text-forest-400 sticky top-0 z-10 bg-slate-50/90 px-4 py-1 text-[11px] font-semibold text-slate-400 backdrop-blur-xs">
                {dateGroup}
              </div>

              <div className="dark:divide-forest-800 divide-y divide-slate-100">
                {itemsInDate.map((item) => {
                  const isUnread = item.readAt === null;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition ${
                        isUnread
                          ? 'dark:bg-forest-850/60 dark:hover:bg-forest-800/60 bg-emerald-50/25 hover:bg-slate-50/90'
                          : 'dark:bg-forest-900 dark:hover:bg-forest-850/50 bg-white hover:bg-slate-50/90'
                      }`}
                    >
                      <div className="dark:bg-forest-800 relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-2 ring-[#00b14f]/20">
                        <Image
                          src="/intervue-logo-transparent.png"
                          alt="InterVue"
                          width={24}
                          height={24}
                          className="h-5 w-auto object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`line-clamp-1 text-[13px] leading-snug ${
                            isUnread
                              ? 'dark:text-forest-50 font-bold text-slate-900'
                              : 'dark:text-forest-200 font-medium text-slate-700'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="dark:text-forest-300 mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {item.summary}
                        </p>
                        <span className="dark:text-forest-400 mt-1 block text-[10.5px] text-slate-400">
                          {formatNotificationDate(item.createdAt)}
                        </span>
                      </div>

                      {isUnread && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#00b14f] ring-2 ring-emerald-200 dark:ring-emerald-900" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-950/80 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-center">
        <Link
          href={baseRoute}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00b14f] transition hover:text-[#00873c] dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <span>View all notifications</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
