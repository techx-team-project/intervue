'use client';

import { MOCK_ADMIN_NOTIFICATIONS, MOCK_RECRUITER_NOTIFICATIONS } from '@/mocks/notification.mock';
import type { AppNotification, NotificationCategory, NotificationTarget } from '@/types/notification';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY_PREFIX = 'intervue.notifications.';
const STORAGE_VERSION = 'v2';
const NOTIFICATION_EVENT = 'intervue:notifications-updated';

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

const memoryCache: Record<NotificationTarget, AppNotification[] | null> = {
  recruiter: null,
  admin: null,
};

function getInitialForTarget(target: NotificationTarget): AppNotification[] {
  return target === 'admin' ? MOCK_ADMIN_NOTIFICATIONS : MOCK_RECRUITER_NOTIFICATIONS;
}

function readNotifications(target: NotificationTarget): AppNotification[] {
  if (typeof window === 'undefined') return getInitialForTarget(target);
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${target}.${STORAGE_VERSION}`);
    if (!raw) return getInitialForTarget(target);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return getInitialForTarget(target);
  } catch {
    return getInitialForTarget(target);
  }
}

function writeNotifications(target: NotificationTarget, items: AppNotification[]) {
  memoryCache[target] = items;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${target}.${STORAGE_VERSION}`, JSON.stringify(items));
      window.dispatchEvent(
        new CustomEvent(NOTIFICATION_EVENT, {
          detail: { target, count: items.filter((n) => !n.isRead).length },
        }),
      );
    } catch {
      // Ignore quota errors
    }
  }
  notifyListeners();
}

function getSnapshot(target: NotificationTarget): AppNotification[] {
  if (memoryCache[target] === null) {
    memoryCache[target] = readNotifications(target);
  }
  return memoryCache[target]!;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key?.startsWith(STORAGE_KEY_PREFIX)) {
      memoryCache.recruiter = null;
      memoryCache.admin = null;
      callback();
    }
  };
  const handleCustom = () => {
    memoryCache.recruiter = null;
    memoryCache.admin = null;
    callback();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
    window.addEventListener(NOTIFICATION_EVENT, handleCustom);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(NOTIFICATION_EVENT, handleCustom);
    }
  };
}

export function useNotificationCount(target: NotificationTarget): number {
  const all = useSyncExternalStore(
    subscribe,
    () => getSnapshot(target),
    () => getInitialForTarget(target),
  );
  return all.filter((n) => !n.isRead).length;
}

export function useNotifications(target: NotificationTarget) {
  const allNotifications = useSyncExternalStore(
    subscribe,
    () => getSnapshot(target),
    () => getInitialForTarget(target),
  );

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return allNotifications;
    return allNotifications.filter((n) => n.category === activeCategory);
  }, [allNotifications, activeCategory]);

  const unreadCount = useMemo(() => {
    return allNotifications.filter((n) => !n.isRead).length;
  }, [allNotifications]);

  const markAsRead = useCallback(
    (id: string) => {
      const next = allNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      writeNotifications(target, next);
    },
    [allNotifications, target],
  );

  const markAllAsRead = useCallback(() => {
    const next = allNotifications.map((n) => ({ ...n, isRead: true }));
    writeNotifications(target, next);
  }, [allNotifications, target]);

  const getNotificationById = useCallback(
    (id: string): AppNotification | undefined => {
      return allNotifications.find((n) => n.id === id);
    },
    [allNotifications],
  );

  return {
    notifications: allNotifications,
    filteredNotifications,
    activeCategory,
    setActiveCategory,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationById,
  };
}
