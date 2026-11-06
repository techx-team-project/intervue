'use client';

import { adminAuthApi } from '@/apiRequest/admin-auth';
import PanelBrandSplash from '@/components/common/PanelBrandSplash';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAdminTheme } from '@/hooks/useAdminTheme';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { isApiError } from '@/lib/api-error';
import type { AdminAccountState, AdminPermission, AdminQueueCounts } from '@/types/admin';
import { useQuery } from '@tanstack/react-query';
import { Lock, LogOut, ShieldCheck } from 'lucide-react';
import { ReactNode, useEffect, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
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
  const [isLocked, setIsLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const logout = useLogout();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');
    if (!unlockPassword) {
      setUnlockError('Please enter your administrator password.');
      return;
    }
    setIsUnlocking(true);
    try {
      await adminAuthApi.verifyPassword(unlockPassword);
      setIsLocked(false);
      setUnlockPassword('');
      toast.success('Session unlocked. Workspace resumed.');
    } catch (err) {
      if (isApiError(err)) {
        setUnlockError(err.message || 'Incorrect password.');
      } else {
        setUnlockError('Verification failed. Please try again.');
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  // Real Admin profile & queue counts
  const { data: profile } = useQuery({
    queryKey: ['admin', 'me'],
    queryFn: () => adminAuthApi.getMe(),
    staleTime: 60_000,
    retry: false,
  });

  const liveQueueCounts: AdminQueueCounts = {
    ...queueCounts,
    businessVerification: profile?.queueCounts?.pendingVerifications ?? queueCounts?.businessVerification ?? 0,
  };

  const liveAccount: AdminAccountState = {
    twoFactorEnabled: profile?.twoFactorEnabled ?? account.twoFactorEnabled,
  };

  // 15-minute idle lock
  useEffect(() => {
    const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsLocked(true);
      }, IDLE_TIMEOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevRoot = root.style.overscrollBehaviorY;
    const prevBody = body.style.overscrollBehaviorY;

    root.style.overscrollBehaviorY = 'none';
    body.style.overscrollBehaviorY = 'none';

    return () => {
      root.style.overscrollBehaviorY = prevRoot;
      body.style.overscrollBehaviorY = prevBody;
    };
  }, []);

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
    <div className="text-navy dark:bg-forest-950 dark:text-forest-50 flex min-h-screen flex-col overscroll-y-none bg-[#f4f5f5] font-sans antialiased">
      <PanelBrandSplash variant="admin" theme={theme} />

      <AdminTopBar
        queueCounts={liveQueueCounts}
        onToggleSidebar={() => setSidebarCollapsed(!isCollapsed)}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      <div className="flex w-full flex-1 flex-col lg:flex-row">
        <AdminSidebar
          isCollapsed={isCollapsed}
          queueCounts={liveQueueCounts}
          twoFactorEnabled={liveAccount.twoFactorEnabled}
          adminName={profile?.name || user?.name}
          adminEmail={profile?.email || user?.email}
          permissions={permissions}
          onExpand={() => setSidebarCollapsed(false)}
          className="dark:border-forest-800 hidden border-[#e2e8f0] transition-[width] duration-200 lg:sticky lg:top-18 lg:block lg:h-[calc(100vh-4.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:border-r"
        />

        <main className="min-w-0 flex-1">
          <AdminPageBar permissions={permissions} />

          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Idle Lock Overlay */}
      {isLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 antialiased backdrop-blur-md">
          <div className="mx-4 w-full max-w-sm rounded-3xl border border-slate-700/80 bg-slate-900 p-8 text-white shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/80 text-emerald-400">
              <Lock className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-center text-lg font-bold">Session Auto-Locked</h3>
            <p className="mt-1.5 text-center text-xs leading-relaxed text-slate-400">
              Console access was locked after 15 minutes of inactivity to protect sensitive platform data. Enter your
              password to resume.
            </p>

            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <div>
                <PasswordInput
                  placeholder="Enter administrator password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-emerald-500"
                  autoFocus
                />
                {unlockError && <p className="mt-1.5 text-left text-xs text-rose-400">{unlockError}</p>}
              </div>

              <Button
                type="submit"
                isLoading={isUnlocking}
                disabled={isUnlocking || !unlockPassword}
                className="w-full bg-emerald-600 font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
                leftIcon={<ShieldCheck className="h-4 w-4" />}
              >
                Unlock Session
              </Button>

              <button
                type="button"
                onClick={() => logout.mutate()}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out of console
              </button>
            </form>
          </div>
        </div>
      )}

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
