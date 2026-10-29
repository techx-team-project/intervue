'use client';

import { ROUTES } from '@/constants/routes';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationCategory, NotificationTarget } from '@/types/notification';
import { ArrowRight, CheckCheck, Filter, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

interface NotificationDropdownProps {
  target: NotificationTarget;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const CATEGORY_TABS: { key: NotificationCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'applications', label: 'Applications' },
  { key: 'connections', label: 'Connect' },
  { key: 'system', label: 'System' },
];

type TimeRangeOption = '7days' | '30days' | '60days' | 'custom';

export default function NotificationDropdown({ target, isOpen, onClose, className }: NotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Time filter state (matching TopCV)
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const [selectedTimeOption, setSelectedTimeOption] = useState<TimeRangeOption | null>(null);
  const [appliedTimeFilter, setAppliedTimeFilter] = useState<TimeRangeOption | null>(null);
  const [filterReferenceTime, setFilterReferenceTime] = useState(0);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [appliedCustomFrom, setAppliedCustomFrom] = useState('');
  const [appliedCustomTo, setAppliedCustomTo] = useState('');

  const { filteredNotifications, activeCategory, setActiveCategory, markAsRead, markAllAsRead } =
    useNotifications(target);

  // Close when clicking outside
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

  // Apply time filtering to notifications
  const timeFilteredNotifications = useMemo(() => {
    if (!appliedTimeFilter) return filteredNotifications;

    const referenceNow = filterReferenceTime || 1793274600000;
    return filteredNotifications.filter((n) => {
      const itemTime = new Date(n.createdAt).getTime();
      if (Number.isNaN(itemTime)) return true;

      if (appliedTimeFilter === '7days') {
        return referenceNow - itemTime <= 7 * 24 * 60 * 60 * 1000;
      }
      if (appliedTimeFilter === '30days') {
        return referenceNow - itemTime <= 30 * 24 * 60 * 60 * 1000;
      }
      if (appliedTimeFilter === '60days') {
        return referenceNow - itemTime <= 60 * 24 * 60 * 60 * 1000;
      }
      if (appliedTimeFilter === 'custom') {
        const fromTime = appliedCustomFrom ? new Date(appliedCustomFrom).getTime() : 0;
        const toTime = appliedCustomTo ? new Date(appliedCustomTo + 'T23:59:59Z').getTime() : Infinity;
        return itemTime >= fromTime && itemTime <= toTime;
      }
      return true;
    });
  }, [filteredNotifications, appliedTimeFilter, filterReferenceTime, appliedCustomFrom, appliedCustomTo]);

  if (!isOpen) return null;

  const viewAllRoute = target === 'admin' ? ROUTES.ADMIN_NOTIFICATIONS : ROUTES.RECRUITER_NOTIFICATIONS;

  const handleItemClick = (id: string) => {
    markAsRead(id);
    onClose();
    const detailRoute = target === 'admin' ? `/admin/notifications/${id}` : `/recruiter/notifications/${id}`;
    router.push(detailRoute);
  };

  const handleApplyTimeFilter = () => {
    setAppliedTimeFilter(selectedTimeOption);
    setFilterReferenceTime(Date.now());
    setAppliedCustomFrom(customFrom);
    setAppliedCustomTo(customTo);
    setIsTimeFilterOpen(false);
  };

  const handleResetTimeFilter = () => {
    setSelectedTimeOption(null);
    setAppliedTimeFilter(null);
    setFilterReferenceTime(0);
    setCustomFrom('');
    setCustomTo('');
    setAppliedCustomFrom('');
    setAppliedCustomTo('');
    setIsTimeFilterOpen(false);
  };

  // Group notifications by displayDate
  const groupedDates = Array.from(new Set(timeFilteredNotifications.map((n) => n.displayDate)));

  const isFilterActive = Boolean(appliedTimeFilter);

  return (
    <div
      ref={dropdownRef}
      className={`dark:border-forest-800 dark:bg-forest-900 animate-in fade-in-0 zoom-in-95 absolute top-full right-0 z-50 mt-2.5 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 duration-150 sm:w-[420px] dark:ring-white/5 ${
        className || ''
      }`}
    >
      {/* Header */}
      <div className="dark:border-forest-800 dark:bg-forest-900 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5">
        <h3 className="dark:text-forest-50 text-base font-bold text-slate-900">Notifications</h3>

        <div className="flex items-center gap-1.5">
          {/* Time filter toggle icon matching TopCV */}
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

          {/* Mark all as read icon */}
          <button
            type="button"
            onClick={markAllAsRead}
            title="Mark all as read"
            aria-label="Mark all as read"
            className="dark:text-forest-400 dark:hover:bg-forest-850 flex items-center gap-1 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-[#00b14f] dark:hover:text-emerald-400"
          >
            <CheckCheck className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Time Filter Panel (matching TopCV Image) */}
      {isTimeFilterOpen && (
        <div className="dark:border-forest-800 dark:bg-forest-900 animate-in fade-in-0 slide-in-from-top-2 border-b border-slate-100 bg-white p-4 duration-150">
          <p className="dark:text-forest-100 text-xs font-bold text-slate-900 sm:text-sm">Filter by time</p>

          {/* Preset Chips */}
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

          {/* Custom Date Inputs */}
          {selectedTimeOption === 'custom' && (
            <div className="mt-3 flex items-center gap-2 pt-1 text-xs">
              <div className="flex-1">
                <label className="dark:text-forest-400 mb-1 block text-[11px] font-semibold text-slate-500">
                  From:
                </label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-100 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="dark:text-forest-400 mb-1 block text-[11px] font-semibold text-slate-500">To:</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-100 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Action buttons (Reset & Apply) */}
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

      {/* Category Filter Chips */}
      <div className="dark:border-forest-800 dark:bg-forest-950/60 flex scrollbar-none items-center gap-1.5 overflow-x-auto border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#00b14f] text-white shadow-2xs'
                  : 'dark:bg-forest-850 dark:text-forest-300 dark:hover:bg-forest-800 dark:border-forest-800 border border-slate-200 bg-white text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="dark:divide-forest-800 max-h-[380px] divide-y divide-slate-100 overflow-y-auto">
        {timeFilteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <Sparkles className="dark:text-forest-600 mx-auto h-8 w-8 stroke-[1.5] text-slate-300" />
            <p className="dark:text-forest-400 mt-2 text-xs font-semibold text-slate-500">
              No notifications found matching this filter
            </p>
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetTimeFilter}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00b14f] hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Clear time filter</span>
              </button>
            )}
          </div>
        ) : (
          groupedDates.map((dateGroup) => {
            const itemsInDate = timeFilteredNotifications.filter((n) => n.displayDate === dateGroup);

            return (
              <div key={dateGroup}>
                <div className="dark:bg-forest-950/90 dark:text-forest-400 sticky top-0 z-10 bg-slate-50/90 px-4 py-1 text-[11px] font-semibold text-slate-400 backdrop-blur-xs">
                  {dateGroup}
                </div>

                <div className="dark:divide-forest-800 divide-y divide-slate-100">
                  {itemsInDate.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition ${
                        !item.isRead
                          ? 'dark:bg-forest-850/60 dark:hover:bg-forest-800/60 bg-emerald-50/25 hover:bg-slate-50/90'
                          : 'dark:bg-forest-900 dark:hover:bg-forest-850/50 bg-white hover:bg-slate-50/90'
                      }`}
                    >
                      {/* InterVue Brand Emblem */}
                      <div className="dark:bg-forest-800 relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-2 ring-[#00b14f]/20">
                        <Image
                          src="/intervue-logo-transparent.png"
                          alt="InterVue"
                          width={24}
                          height={24}
                          className="h-5 w-auto object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`line-clamp-1 text-[13px] leading-snug ${
                            !item.isRead
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
                          {item.displayDate}
                        </span>
                      </div>

                      {/* Unread indicator */}
                      {!item.isRead && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#00b14f] ring-2 ring-emerald-200 dark:ring-emerald-900" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link to full notification center */}
      <div className="dark:border-forest-800 dark:bg-forest-950/80 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-center">
        <Link
          href={viewAllRoute}
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
