'use client';

import { ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react';
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
  const shellRef = useRef<HTMLDivElement>(null);
  const stickyTopRef = useRef<HTMLDivElement>(null);

  // Overscroll bounce translates the whole document, which drags the sticky
  // header and sidebar with it. Disabling it only while the panel is mounted
  // keeps them perfectly still without changing the public site.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overscrollBehaviorY;
    root.style.overscrollBehaviorY = 'none';

    return () => {
      root.style.overscrollBehaviorY = previous;
    };
  }, []);

  // The notice bar wraps to a different number of lines per viewport and can be
  // dismissed, so the sidebar offset is measured instead of hard-coded.
  useEffect(() => {
    const stickyTop = stickyTopRef.current;
    const shell = shellRef.current;
    if (!stickyTop || !shell) return;

    const syncOffset = () => shell.style.setProperty('--recruiter-sticky-top', `${stickyTop.offsetHeight}px`);
    syncOffset();

    const observer = new ResizeObserver(syncOffset);
    observer.observe(stickyTop);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={shellRef}
      className="text-navy flex min-h-screen flex-col bg-[#f4f5f5] antialiased [--recruiter-sticky-top:4rem]"
    >
      {/* Notice + header scroll as one block so both stay pinned to the top. */}
      <div ref={stickyTopRef} className="sticky top-0 z-40">
        <RecruiterTopNotice />

        <RecruiterHeader
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!isCollapsed)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
        <RecruiterSidebar
          isCollapsed={isCollapsed}
          className="hidden border-[#e2e8f0] transition-[width] duration-200 lg:sticky lg:top-[var(--recruiter-sticky-top)] lg:block lg:h-[calc(100vh-var(--recruiter-sticky-top))] lg:overflow-y-auto lg:border-r"
        />

        <main className="min-w-0 flex-1 px-2 py-6 sm:px-3 sm:py-5 lg:px-5">{children}</main>
      </div>

      <RecruiterMobileNavDrawer isOpen={isMobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <RecruiterBottomCta />
    </div>
  );
}
