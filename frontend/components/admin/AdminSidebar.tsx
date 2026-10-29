'use client';

import {
  hasActiveDescendant,
  isNavItemActive,
  itemPendingCount,
  sectionPendingCount,
  visibleSections,
} from '@/lib/admin-nav';
import { cn } from '@/lib/utils';
import type { AdminNavItem, AdminNavSection, AdminPermission, AdminQueueCounts } from '@/types/admin';
import { ROUTES } from '@/constants/routes';
import { useNotificationCount } from '@/hooks/useNotifications';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  queueCounts: AdminQueueCounts;
  twoFactorEnabled: boolean;
  adminName?: string;
  adminEmail?: string;
  permissions?: AdminPermission[];
  onNavigate?: () => void;
  onExpand?: () => void;
  className?: string;
}

function filterByQuery(sections: AdminNavSection[], needle: string): AdminNavSection[] {
  if (!needle) return sections;

  return sections
    .map((section) => ({
      ...section,
      items: section.items.reduce<AdminNavItem[]>((kept, item) => {
        if (item.label.toLowerCase().includes(needle)) return [...kept, item];

        const children = (item.children ?? []).filter((child) => child.label.toLowerCase().includes(needle));
        return children.length > 0 ? [...kept, { ...item, children }] : kept;
      }, []),
    }))
    .filter((section) => section.items.length > 0);
}

export default function AdminSidebar({
  isCollapsed,
  queueCounts,
  twoFactorEnabled,
  adminName,
  adminEmail,
  permissions,
  onNavigate,
  onExpand,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const unreadNotificationsCount = useNotificationCount('admin');

  const needle = query.trim().toLowerCase();
  const sections = useMemo(() => filterByQuery(visibleSections(permissions), needle), [permissions, needle]);

  const renderBadge = (count: number, isAction: boolean, isNotification = false) =>
    count > 0 ? (
      <span
        className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold tabular-nums',
          isNotification
            ? 'bg-[#00b14f] text-white shadow-2xs'
            : isAction
              ? 'bg-amber-100 text-amber-700'
              : 'dark:bg-forest-850 dark:text-forest-300 bg-slate-100 text-slate-500',
        )}
      >
        {count > 99 ? '99+' : count}
      </span>
    ) : null;

  const renderItem = (item: AdminNavItem, isAction: boolean, isChild = false) => {
    const Icon = item.icon;
    const isNotification = item.href === ROUTES.ADMIN_NOTIFICATIONS;
    const pending = isNotification ? unreadNotificationsCount : itemPendingCount(item, queueCounts);
    const isActive = isNavItemActive(item.href, pathname);
    const hasChildren = Boolean(item.children?.length) && !item.href;

    if (hasChildren) {
      const isExpanded = toggled[item.label] ?? (hasActiveDescendant(item, pathname) || needle.length > 0);

      if (isCollapsed) {
        return (
          <button
            key={item.label}
            type="button"
            onClick={onExpand}
            title={item.label}
            className="dark:text-forest-300 dark:hover:bg-forest-850 flex w-full cursor-pointer items-center justify-center rounded-xl px-2 py-2.5 text-[#64748b] transition hover:bg-[#f8fafc]"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full">
              {Icon && <Icon className="h-5 w-5" />}
              {pending > 0 && <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-amber-500" />}
            </span>
          </button>
        );
      }

      return (
        <div key={item.label}>
          <button
            type="button"
            onClick={() => setToggled((prev) => ({ ...prev, [item.label]: !isExpanded }))}
            aria-expanded={isExpanded}
            className="dark:text-forest-200 dark:hover:bg-forest-850 flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2.5 text-[13px] font-medium text-[#475569] transition hover:bg-[#f8fafc]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="dark:text-forest-300 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#64748b]">
                {Icon && <Icon className="h-4.5 w-4.5" />}
              </span>
              <span className="truncate">{item.label}</span>
            </span>

            <span className="flex shrink-0 items-center gap-1.5">
              {renderBadge(pending, isAction, isNotification)}
              <ChevronDown
                className={cn(
                  'dark:text-forest-400 h-3.5 w-3.5 text-[#94a3b8] transition-transform',
                  isExpanded && 'rotate-180',
                )}
              />
            </span>
          </button>

          {isExpanded && (
            <div className="dark:border-forest-800 mt-1.5 mb-1 ml-[26px] space-y-1.5 border-l border-[#f1f5f9] pl-3">
              {item.children?.map((child) => renderItem(child, isAction, true))}
            </div>
          )}
        </div>
      );
    }

    if (isCollapsed) {
      if (item.comingSoon) {
        return (
          <div
            key={item.label}
            title={`${item.label} — coming soon`}
            className="dark:text-forest-400 flex items-center justify-center rounded-xl px-2 py-2.5 text-[#cbd5e1]"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full">
              {Icon && <Icon className="h-5 w-5" />}
              {pending > 0 && <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-amber-500" />}
            </span>
          </div>
        );
      }

      return (
        <Link
          key={item.label}
          href={item.href ?? '#'}
          onClick={onNavigate}
          title={item.label}
          className={cn(
            'flex items-center justify-center rounded-xl px-2 py-2.5 transition',
            isActive
              ? 'text-primary'
              : 'dark:text-forest-300 dark:hover:bg-forest-850 text-[#64748b] hover:bg-[#f8fafc]',
          )}
        >
          <span
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-full',
              isActive && 'bg-primary/10 text-primary',
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
            {pending > 0 && (
              <span
                className={cn(
                  'dark:ring-forest-900 absolute top-0.5 right-0.5 h-2 w-2 rounded-full ring-2 ring-white',
                  isNotification ? 'bg-[#00b14f]' : 'bg-amber-500',
                )}
              />
            )}
          </span>
        </Link>
      );
    }

    const rowClass = cn(
      'flex items-center justify-between rounded-xl text-[13px] transition',
      isChild ? 'px-3 py-2.5' : 'px-2.5 py-2.5',
    );

    if (item.comingSoon) {
      return (
        <div
          key={item.label}
          title="Not built yet"
          className={cn(rowClass, 'dark:text-forest-400 cursor-not-allowed font-medium text-[#94a3b8]')}
        >
          <span className="flex min-w-0 items-center gap-3">
            {!isChild && (
              <span className="dark:text-forest-400 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#cbd5e1]">
                {Icon && <Icon className="h-4.5 w-4.5" />}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5">
            {renderBadge(pending, isAction, isNotification)}
            {!isChild && (
              <span className="dark:bg-forest-850 dark:text-forest-300 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500">
                Coming soon
              </span>
            )}
          </span>
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href ?? '#'}
        onClick={onNavigate}
        className={cn(
          rowClass,
          isActive
            ? 'text-primary font-bold'
            : 'dark:text-forest-200 dark:hover:bg-forest-850 font-medium text-[#475569] hover:bg-[#f8fafc]',
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {!isChild && (
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'dark:text-forest-300 text-[#64748b]',
              )}
            >
              {Icon && <Icon className="h-4.5 w-4.5" />}
            </span>
          )}
          <span className="truncate">{item.label}</span>
        </span>

        {renderBadge(pending, isAction, isNotification)}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'scrollbar-on-hover dark:bg-forest-900 shrink-0 bg-white',
        isCollapsed ? 'lg:w-20' : 'lg:w-72',
        className,
      )}
    >
      <div className={isCollapsed ? 'flex justify-center p-3' : 'p-5'}>
        <div className={isCollapsed ? '' : 'flex items-center gap-3.5'}>
          <div
            className={cn(
              'from-primary flex shrink-0 items-center justify-center rounded-2xl bg-linear-to-tr to-[#00d660] font-black text-white shadow-sm',
              isCollapsed ? 'h-10 w-10 text-base' : 'h-12 w-12 text-lg',
            )}
          >
            {adminName?.charAt(0).toUpperCase()}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="dark:text-forest-300 text-[11.5px] text-[#64748b]">Administrator</p>
              <h3 className="text-navy dark:text-forest-50 truncate text-[15px] font-bold">{adminName}</h3>
              <p className="dark:text-forest-300 truncate text-[12px] text-[#64748b]">{adminEmail}</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <>
            <div className="mt-3 flex items-center gap-1.5 text-[12.5px]">
              <span className="dark:text-forest-300 text-[#64748b]">Security:</span>
              <span className={cn('font-bold', twoFactorEnabled ? 'text-[#00873c]' : 'text-rose-600')}>
                {twoFactorEnabled ? '2FA on' : '2FA off'}
              </span>
              <span title="Admin accounts hold the most destructive permissions on the platform">
                <HelpCircle className="h-3.5 w-3.5 text-[#94a3b8]" />
              </span>
            </div>

            {!twoFactorEnabled && (
              <Link
                href={ROUTES.ACCOUNT_TWO_FACTOR}
                onClick={onNavigate}
                className="mt-3 flex w-full items-center justify-center rounded-full bg-amber-600 px-3 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-amber-700"
              >
                Turn on two-factor auth
              </Link>
            )}
          </>
        )}
      </div>

      {!isCollapsed && (
        <div className="px-4 pb-1">
          <label className="dark:border-forest-800 dark:bg-forest-850/60 dark:focus-within:bg-forest-850 flex items-center gap-2 rounded-xl border border-[#e9eaec] bg-[#f8fafc] px-3 py-2 focus-within:border-[#cbd5e1] focus-within:bg-white">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter sections"
              aria-label="Filter sections"
              className="text-navy dark:text-forest-50 min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#94a3b8]"
            />
          </label>
        </div>
      )}

      {sections.length === 0 && !isCollapsed && (
        <p className="px-5 py-4 text-[12.5px] text-[#94a3b8]">No section matches.</p>
      )}

      {sections.map((section, sectionIndex) => {
        const isAction = section.tone === 'action';
        const sectionTotal = sectionPendingCount(section, queueCounts);

        return (
          <nav
            key={section.id}
            aria-label={section.title}
            className={cn(
              'space-y-0.5 px-2 py-1',
              isAction && !isCollapsed && 'mx-2 my-2 rounded-2xl bg-amber-50/60 px-2 py-2 dark:bg-amber-500/5',
            )}
          >
            {sectionIndex > 0 && !isAction && (
              <div className="dark:border-forest-800 mx-1 my-2 border-t border-[#f1f5f9]" />
            )}

            {!isCollapsed && (
              <div className="flex items-center justify-between gap-2 px-2.5 pt-1 pb-1.5">
                <span
                  className={cn(
                    'truncate text-[10.5px] font-bold tracking-wider uppercase',
                    isAction ? 'text-amber-700 dark:text-amber-400' : 'text-[#94a3b8]',
                  )}
                >
                  {section.title}
                </span>

                {isAction && sectionTotal > 0 && (
                  <span className="shrink-0 rounded-full bg-amber-600 px-1.5 py-0.5 text-[10px] font-black text-white tabular-nums">
                    {sectionTotal}
                  </span>
                )}
              </div>
            )}

            {section.items.map((item) => renderItem(item, isAction))}
          </nav>
        );
      })}

      {!isCollapsed && (
        <div className="dark:border-forest-800 mt-4 space-y-1 border-t border-[#f1f5f9] px-4 pt-4 pb-5 text-[11.5px]">
          {/* TODO: wire to real legal routes once they exist */}
          <a href="#" className="text-primary block hover:underline">
            Privacy policy
          </a>
          <a href="#" className="text-primary block hover:underline">
            Cookie policy
          </a>
          <a href="#" className="text-primary block hover:underline">
            Terms of service
          </a>
          <p className="pt-2 text-[#94a3b8]">Version 1.0.0</p>
          <p className="text-[#94a3b8]">© 2024 - 2026 InterVue Vietnam JSC. All rights reserved.</p>
        </div>
      )}
    </aside>
  );
}
