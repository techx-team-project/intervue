'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'intervue:recent-searches';
const MAX_ITEMS = 5;
const EMPTY_ITEMS: string[] = [];

const listeners = new Set<() => void>();
let snapshot: string[] | null = null;

function readStored(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function getSnapshot(): string[] {
  snapshot ??= readStored();
  return snapshot;
}

function getServerSnapshot(): string[] {
  return EMPTY_ITEMS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(items: string[]) {
  snapshot = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable: keep the in-memory list for this session
  }
  listeners.forEach((listener) => listener());
}

export function useRecentSearches() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((keyword: string) => {
    const value = keyword.trim();
    if (!value) return;
    const next = [value, ...getSnapshot().filter((item) => item.toLowerCase() !== value.toLowerCase())];
    commit(next.slice(0, MAX_ITEMS));
  }, []);

  return { items, add };
}
