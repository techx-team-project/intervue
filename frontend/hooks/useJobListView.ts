'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type JobListView = 'list' | 'grid';

const STORAGE_KEY = 'intervue:jobs-view';
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readView(): JobListView {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'grid' ? 'grid' : 'list';
  } catch {
    return 'list';
  }
}

export function useJobListView() {
  const view = useSyncExternalStore(subscribe, readView, () => 'list' as JobListView);

  const setView = useCallback((next: JobListView) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      return;
    }
    listeners.forEach((listener) => listener());
  }, []);

  return [view, setView] as const;
}
