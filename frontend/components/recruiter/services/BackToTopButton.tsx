'use client';

import { ArrowUp } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const SCROLL_THRESHOLD_PX = 360;

function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener('scroll', onStoreChange, { passive: true });
  return () => window.removeEventListener('scroll', onStoreChange);
}

function getScrolledPast(): boolean {
  return window.scrollY > SCROLL_THRESHOLD_PX;
}

export default function BackToTopButton() {
  const isVisible = useSyncExternalStore(subscribeScroll, getScrolledPast, () => false);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-neutral-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-neutral-900"
    >
      <ArrowUp className="h-3.5 w-3.5" />
      Back to top
    </button>
  );
}
