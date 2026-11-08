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
      className={`dark:border-forest-800 dark:bg-forest-900 animate-in fade-in-0 zoom-in-95 border-outline-variant shadow-elevation-2 absolute top-full right-0 z-50 mt-2.5 w-96 overflow-hidden rounded-2xl border bg-white ring-1 ring-black/5 duration-150 sm:w-[420px] dark:ring-white/5 ${
        className || ''
      }`}
    >
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex items-center justify-between border-b bg-white px-4 py-3.5">
        <h3 className="dark:text-forest-50 text-on-surface text-base font-bold">Notifications</h3>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsTimeFilterOpen((prev) => !prev)}
            title="Filter by time"
            aria-label="Filter by time"
            className={`rounded-full p-1.5 transition ${
              isTimeFilterOpen || isFilterActive
                ? 'border-primary/30 bg-primary-light text-primary border dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'dark:text-forest-400 dark:hover:bg-forest-850 dark:hover:text-forest-200 text-outline hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => markAllAsRead()}
            title="Mark all as read"
            aria-label="Mark all as read"
            className="dark:text-forest-400 dark:hover:bg-forest-850 text-on-surface-variant hover:bg-surface-container-high hover:text-primary flex items-center gap-1 rounded-full p-1.5 transition dark:hover:text-emerald-400"
          >
            <CheckCheck className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isTimeFilterOpen && (
        <div className="dark:border-forest-800 dark:bg-forest-900 animate-in fade-in-0 slide-in-from-top-2 border-outline-variant border-b bg-white p-4 duration-150">
          <p className="dark:text-forest-100 text-on-surface text-xs font-bold sm:text-sm">Filter by time</p>

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
                      ? 'border-primary text-primary border bg-[#e6f7ee] font-semibold dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'dark:border-forest-800 dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 border-outline-variant text-on-surface-variant hover:bg-surface-container-low border bg-white'
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
                <label className="dark:text-forest-400 text-label-sm text-on-surface-variant mb-1 block font-semibold">
                  From:
                </label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(event) => setCustomFrom(event.target.value)}
                  className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-100 border-outline-variant text-on-surface focus:border-primary w-full rounded-lg border bg-white px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="dark:text-forest-400 text-label-sm text-on-surface-variant mb-1 block font-semibold">
                  To:
                </label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(event) => setCustomTo(event.target.value)}
                  className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-100 border-outline-variant text-on-surface focus:border-primary w-full rounded-lg border bg-white px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleResetTimeFilter}
              className="dark:border-forest-800 dark:text-forest-300 dark:hover:bg-forest-800 border-outline-variant text-on-surface-variant hover:bg-surface-container-low cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition"
            >
              Reset
            </button>
            <button
              type="button"
              disabled={!selectedTimeOption}
              onClick={handleApplyTimeFilter}
              className="bg-primary hover:bg-primary cursor-pointer rounded-full px-5 py-1.5 text-xs font-bold text-white shadow-xs transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/60 flex scrollbar-none items-center gap-1.5 overflow-x-auto border-b px-4 py-2.5">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? 'bg-primary text-white shadow-2xs'
                  : 'dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 dark:border-forest-800 border-outline-variant text-on-surface-variant hover:bg-surface-container-high/70 border bg-white'
              }`}
            >
              {notificationTabLabel(tab, vi)}
            </button>
          );
        })}
      </div>

      <div className="dark:divide-forest-800 divide-outline-variant max-h-[380px] divide-y overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="dark:bg-forest-800 bg-surface-container-high h-9 w-9 shrink-0 animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="dark:bg-forest-800 bg-surface-container-high h-3.5 w-3/4 animate-pulse rounded" />
                  <div className="dark:bg-forest-800 bg-surface-container-high h-3 w-full animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 stroke-[1.5] text-amber-500" />
            <p className="dark:text-forest-300 text-on-surface-variant mt-2 text-xs font-semibold">{copy.loadError}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-primary mt-3 inline-flex items-center gap-1 text-xs font-bold hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{copy.retry}</span>
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Sparkles className="dark:text-forest-600 text-outline mx-auto h-8 w-8 stroke-[1.5]" />
            <p className="dark:text-forest-400 text-on-surface-variant mt-2 text-xs font-semibold">
              {copy.emptyFiltered}
            </p>
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetTimeFilter}
                className="text-primary mt-3 inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{copy.clearTimeFilter}</span>
              </button>
            )}
          </div>
        ) : (
          grouped.map(([dateGroup, itemsInDate]) => (
            <div key={dateGroup}>
              <div className="dark:bg-forest-950/90 dark:text-forest-400 bg-surface-container-low/90 text-label-sm text-outline sticky top-0 z-10 px-4 py-1 font-semibold backdrop-blur-xs">
                {dateGroup}
              </div>

              <div className="dark:divide-forest-800 divide-outline-variant divide-y">
                {itemsInDate.map((item) => {
                  const isUnread = item.readAt === null;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition ${
                        isUnread
                          ? 'dark:bg-forest-850/60 dark:hover:bg-forest-800/60 hover:bg-surface-container-low/90 bg-emerald-50/25'
                          : 'dark:bg-forest-900 dark:hover:bg-forest-850/50 hover:bg-surface-container-low/90 bg-white'
                      }`}
                    >
                      <div className="dark:bg-forest-800 bg-surface-container-high relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ring-[#00b14f]/20">
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
                          className={`text-body-md line-clamp-1 leading-snug ${
                            isUnread
                              ? 'dark:text-forest-50 text-on-surface font-bold'
                              : 'dark:text-forest-200 text-on-surface font-medium'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="dark:text-forest-300 text-on-surface-variant mt-1 line-clamp-2 text-xs leading-relaxed">
                          {item.summary}
                        </p>
                        <span className="dark:text-forest-400 text-label-sm text-outline mt-1 block">
                          {formatNotificationDate(item.createdAt)}
                        </span>
                      </div>

                      {isUnread && (
                        <span className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full ring-2 ring-emerald-200 dark:ring-emerald-900" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-950/80 border-outline-variant bg-surface-container-low/80 border-t px-4 py-2.5 text-center">
        <Link
          href={baseRoute}
          onClick={onClose}
          className="text-primary hover:text-primary inline-flex items-center gap-1.5 text-xs font-bold transition dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <span>View all notifications</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
