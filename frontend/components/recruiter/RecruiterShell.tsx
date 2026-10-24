'use client';

import { ReactNode, useState, useSyncExternalStore } from 'react';
import RecruiterBottomCta from './RecruiterBottomCta';
import RecruiterHeader from './RecruiterHeader';
import RecruiterMobileNavDrawer from './RecruiterMobileNavDrawer';
import RecruiterSidebar from './RecruiterSidebar';
import RecruiterTopNotice from './RecruiterTopNotice';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'intervue.recruiter.sidebarCollapsed';
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

export default function RecruiterShell({ children }: { children: ReactNode }) {
  const isCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="text-navy flex min-h-screen flex-col bg-[#f4f5f5] antialiased">
      {/* Top Critical Notice Bar (above entire header, matching TopCV) */}
      <RecruiterTopNotice />

      <RecruiterHeader
        isSidebarCollapsed={isCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!isCollapsed)}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
        <RecruiterSidebar
          isCollapsed={isCollapsed}
          className="hidden border-[#e2e8f0] transition-[width] duration-200 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-r"
        />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>

      <RecruiterMobileNavDrawer isOpen={isMobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <RecruiterBottomCta />
    </div>
  );
}
