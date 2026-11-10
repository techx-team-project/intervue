'use client';

import { useSyncExternalStore } from 'react';

const TICK_MS = 1000;

function subscribe(onStoreChange: () => void) {
  const timer = setInterval(onStoreChange, TICK_MS);
  return () => clearInterval(timer);
}

// Date.now() may not be read during render (React Compiler treats it as impure),
// so the clock is an external store the component subscribes to instead.
function getSnapshot() {
  return Math.floor(Date.now() / TICK_MS);
}

export function useCountdown(targetIso: string | null): number | null {
  const nowSeconds = useSyncExternalStore(subscribe, getSnapshot, () => null);
  if (nowSeconds === null || !targetIso) return null;
  return Math.max(0, Math.floor(new Date(targetIso).getTime() / TICK_MS) - nowSeconds);
}

export function formatRemaining(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (days > 0) return `${days} ngày : ${hours} giờ : ${minutes} phút`;
  return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(rest).padStart(2, '0')}`;
}
