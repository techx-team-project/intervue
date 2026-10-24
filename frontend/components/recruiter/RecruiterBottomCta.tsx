'use client';

import { ROUTES } from '@/constants/routes';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

const DISMISS_STORAGE_KEY = 'intervue.recruiter.bottomCtaDismissedUntil';
const REAPPEAR_AFTER_MS = 24 * 60 * 60 * 1000;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  const dismissedUntil = Number(localStorage.getItem(DISMISS_STORAGE_KEY) ?? '0');
  return Date.now() >= dismissedUntil;
}

function getServerSnapshot() {
  return true;
}

function dismiss() {
  localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now() + REAPPEAR_AFTER_MS));
  listeners.forEach((callback) => callback());
}

export default function RecruiterBottomCta() {
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 bottom-4 z-30 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:bottom-6 sm:w-auto">
      <div className="to-primary relative flex items-start gap-3 rounded-2xl bg-linear-to-br from-[#0c2e24] via-[#103a2e] p-4 pr-8 text-white shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2.5 right-2.5 cursor-pointer rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Sparkles className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <p className="text-[13px] font-bold">Need to hire faster?</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-white/80">
            Explore service packages that make your job posts stand out to the right IT candidates.
          </p>
          <Link
            href={ROUTES.RECRUITER_SERVICES}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-white hover:underline"
          >
            <span>View packages</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
