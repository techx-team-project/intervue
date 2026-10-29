'use client';

import PanelBrandSplash from '@/components/common/PanelBrandSplash';
import { useAdminTheme } from '@/hooks/useAdminTheme';
import { useAuth } from '@/hooks/useAuth';
import type { AdminAccountState, AdminPermission, AdminQueueCounts } from '@/types/admin';
import { ReactNode, useEffect, useState, useSyncExternalStore } from 'react';
import AdminCommandPalette from './AdminCommandPalette';
import AdminMobileNavDrawer from './AdminMobileNavDrawer';
import AdminPageBar from './AdminPageBar';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

interface AdminShellProps {
  children: ReactNode;
  queueCounts: AdminQueueCounts;
  account: AdminAccountState;
  permissions?: AdminPermission[];
}

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'intervue.admin.sidebarCollapsed';
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
}

function getServerSnapshot() {
  return false;
}

function setSidebarCollapsed(value: boolean) {
  localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(value));
  listeners.forEach((callback) => callback());
}

export default function AdminShell({ children, queueCounts, account, permissions }: AdminShellProps) {
  const { user } = useAuth();
  const { theme } = useAdminTheme();
  const isCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="text-navy dark:bg-forest-950 dark:text-forest-50 flex min-h-screen flex-col overscroll-y-none bg-[#f4f5f5] antialiased">
      <PanelBrandSplash variant="admin" theme={theme} />

      <AdminTopBar
        queueCounts={queueCounts}
        onToggleSidebar={() => setSidebarCollapsed(!isCollapsed)}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      <div className="flex w-full flex-1 flex-col lg:flex-row">
        <AdminSidebar
          isCollapsed={isCollapsed}
          queueCounts={queueCounts}
          twoFactorEnabled={account.twoFactorEnabled}
          adminName={user?.name}
          adminEmail={user?.email}
          permissions={permissions}
          onExpand={() => setSidebarCollapsed(false)}
          className="dark:border-forest-800 hidden border-[#e2e8f0] transition-[width] duration-200 lg:sticky lg:top-18 lg:block lg:h-[calc(100vh-4.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:border-r"
        />

        <main className="min-w-0 flex-1">
          <AdminPageBar permissions={permissions} />

          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</div>
        </main>
      </div>

      {isMobileNavOpen && (
        <AdminMobileNavDrawer
          onClose={() => setMobileNavOpen(false)}
          queueCounts={queueCounts}
          twoFactorEnabled={account.twoFactorEnabled}
          adminName={user?.name}
          adminEmail={user?.email}
          permissions={permissions}
        />
      )}

      {isPaletteOpen && (
        <AdminCommandPalette
          onClose={() => setPaletteOpen(false)}
          queueCounts={queueCounts}
          permissions={permissions}
        />
      )}
    </div>
  );
}
