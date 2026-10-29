'use client';

import NotificationDropdown from '@/components/common/NotificationDropdown';
import { ADMIN_QUICK_LINKS } from '@/constants/admin-work';
import { ROUTES } from '@/constants/routes';
import { useAdminTheme } from '@/hooks/useAdminTheme';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationCount } from '@/hooks/useNotifications';
import type { AdminQueueCounts } from '@/types/admin';
import { Bell, ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import AdminUserMenuDropdown from './AdminUserMenuDropdown';

interface AdminTopBarProps {
  queueCounts: AdminQueueCounts;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
}

const ICON_BUTTON_CLASS =
  'dark:text-forest-700 dark:hover:bg-forest-950/10 dark:hover:text-forest-950 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white';

export default function AdminTopBar({ queueCounts, onToggleSidebar, onOpenMobileNav }: AdminTopBarProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useAdminTheme();
  const unreadNotifications = useNotificationCount('admin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-dark dark:bg-forest-50 sticky top-0 z-40 w-full">
      <div className="flex h-18 w-full items-center gap-3 px-4 sm:px-5 lg:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open the menu"
          className={`${ICON_BUTTON_CLASS} lg:hidden`}
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle the menu"
          title="Toggle the menu"
          className={`${ICON_BUTTON_CLASS} hidden lg:flex`}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* The knockout file is transparent and cropped, so it needs no blending and sits on any
            header colour. The colour file keeps its baked white box, which multiply clears exactly. */}
        <Link href={ROUTES.ADMIN_DASHBOARD} className="flex shrink-0 items-center" aria-label="InterVue Admin">
          <Image
            src="/intervue-logo-white.png"
            alt="InterVue"
            width={1588}
            height={324}
            priority
            className="h-7.5 w-auto dark:hidden"
          />
          <Image
            src="/intervue-logo.png"
            alt="InterVue"
            width={948}
            height={258}
            priority
            className="hidden h-10 w-auto mix-blend-multiply dark:block"
          />
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          <nav aria-label="Quick access" className="hidden items-center gap-2 xl:flex">
            {ADMIN_QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              const count = queueCounts[link.queue] ?? 0;

              return (
                <Link
                  key={link.queue}
                  href={`${ROUTES.ADMIN_DASHBOARD}?queue=${link.kind}`}
                  className="dark:border-forest-700/20 dark:text-forest-800 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-forest-950 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-white/85 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {count > 0 && <span className="font-black tabular-nums">{count}</span>}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className={ICON_BUTTON_CLASS}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationOpen((prev) => !prev);
                setIsMenuOpen(false);
              }}
              title="Notifications"
              aria-label="Notifications"
              className={`relative ${ICON_BUTTON_CLASS}`}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="ring-dark dark:ring-forest-50 absolute top-0.5 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </button>

            <NotificationDropdown
              target="admin"
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Account menu"
              className="flex cursor-pointer items-center rounded-full p-0.5 transition hover:scale-105 active:scale-95"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 via-emerald-600 to-teal-600 text-sm font-black text-white shadow-sm ring-2 ring-emerald-400/30">
                {user?.name.charAt(0).toUpperCase()}
                <span className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200">
                  <ChevronDown className="h-2 w-2 stroke-[2.5] text-emerald-700" />
                </span>
              </span>
            </button>

            {isMenuOpen && <AdminUserMenuDropdown onClose={() => setIsMenuOpen(false)} />}
          </div>
        </div>
      </div>
    </header>
  );
}
