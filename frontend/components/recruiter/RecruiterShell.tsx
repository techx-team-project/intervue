'use client';

import { ReactNode, useSyncExternalStore } from 'react';
import RecruiterBottomCta from './RecruiterBottomCta';
import RecruiterHeader from './RecruiterHeader';
import RecruiterSidebar from './RecruiterSidebar';

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

  return (
    <div className="text-navy flex min-h-screen flex-col bg-[#f4f5f5] antialiased">
      <RecruiterHeader isSidebarCollapsed={isCollapsed} onToggleSidebar={() => setSidebarCollapsed(!isCollapsed)} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
        <RecruiterSidebar isCollapsed={isCollapsed} />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <RecruiterBottomCta />
    </div>
  );
}
