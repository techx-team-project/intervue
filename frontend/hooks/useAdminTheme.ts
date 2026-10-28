'use client';

import { useEffect, useSyncExternalStore } from 'react';

export type AdminTheme = 'light' | 'dark';

const STORAGE_KEY = 'intervue.admin.theme';
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): AdminTheme {
  return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): AdminTheme {
  return 'light';
}

export function useAdminTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Scoped to the admin panel on purpose: the attribute is removed on unmount so
  // the public site and the recruiter panel never inherit the admin's theme.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  const toggleTheme = () => {
    localStorage.setItem(STORAGE_KEY, theme === 'dark' ? 'light' : 'dark');
    listeners.forEach((callback) => callback());
  };

  return { theme, toggleTheme };
}
