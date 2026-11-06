'use client';

import { notificationApi } from '@/apiRequest/notification';
import type { NotificationCategory, NotificationCategoryFilter, NotificationRealm } from '@/types/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

const UNREAD_POLL_MS = 60_000;
const DEFAULT_PAGE_SIZE = 10;

export type NotificationTimeRange = { from?: string; to?: string };

export const notificationKeys = {
  all: (realm: NotificationRealm) => ['notifications', realm] as const,
  list: (
    realm: NotificationRealm,
    category: NotificationCategoryFilter,
    page: number,
    size: number,
    range: NotificationTimeRange,
  ) => ['notifications', realm, 'list', category, page, size, range.from ?? '', range.to ?? ''] as const,
  detail: (realm: NotificationRealm, id: number) => ['notifications', realm, 'detail', id] as const,
  unread: (realm: NotificationRealm) => ['notifications', realm, 'unread'] as const,
  preferences: (realm: NotificationRealm) => ['notifications', realm, 'preferences'] as const,
};

function toCategory(filter: NotificationCategoryFilter): NotificationCategory | undefined {
  return filter === 'ALL' ? undefined : filter;
}

export function useUnreadCount(realm: NotificationRealm, enabled = true) {
  const query = useQuery({
    queryKey: notificationKeys.unread(realm),
    queryFn: () => notificationApi.unreadCount(realm),
    enabled,
    refetchInterval: UNREAD_POLL_MS,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return {
    total: query.data?.total ?? 0,
    byCategory: query.data?.byCategory ?? {},
    isLoading: query.isLoading,
  };
}

export function useNotifications(realm: NotificationRealm, pageSize = DEFAULT_PAGE_SIZE) {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategoryState] = useState<NotificationCategoryFilter>('ALL');
  const [page, setPage] = useState(0);
  const [timeRange, setTimeRangeState] = useState<NotificationTimeRange>({});

  const listQuery = useQuery({
    queryKey: notificationKeys.list(realm, activeCategory, page, pageSize, timeRange),
    queryFn: () =>
      notificationApi.search(realm, {
        category: toCategory(activeCategory),
        from: timeRange.from,
        to: timeRange.to,
        page,
        size: pageSize,
      }),
    staleTime: 15_000,
  });

  const unread = useUnreadCount(realm);

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all(realm) });
  }, [queryClient, realm]);

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markRead(realm, id),
    onSuccess: invalidate,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(realm, toCategory(activeCategory)),
    onSuccess: invalidate,
  });

  const markAllSeenMutation = useMutation({
    mutationFn: () => notificationApi.markAllSeen(realm),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.unread(realm) }),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: number) => notificationApi.archive(realm, id),
    onSuccess: invalidate,
  });

  const setActiveCategory = useCallback((category: NotificationCategoryFilter) => {
    setActiveCategoryState(category);
    setPage(0);
  }, []);

  const setTimeRange = useCallback((range: NotificationTimeRange) => {
    setTimeRangeState(range);
    setPage(0);
  }, []);

  return {
    notifications: listQuery.data?.items ?? [],
    totalItems: listQuery.data?.totalItems ?? 0,
    totalPages: listQuery.data?.totalPages ?? 0,
    page,
    setPage,
    pageSize,
    activeCategory,
    setActiveCategory,
    timeRange,
    setTimeRange,
    unreadCount: unread.total,
    unreadByCategory: unread.byCategory,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllSeen: markAllSeenMutation.mutate,
    archive: archiveMutation.mutate,
    isMarkingAll: markAllAsReadMutation.isPending,
  };
}

export function useNotificationDetail(realm: NotificationRealm, id: number | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationKeys.detail(realm, id ?? 0),
    queryFn: () => notificationApi.getById(realm, id as number),
    enabled: id !== null,
  });

  const markAsRead = useMutation({
    mutationFn: (notificationId: number) => notificationApi.markRead(realm, notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all(realm) }),
  });

  return {
    notification: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    markAsRead: markAsRead.mutate,
  };
}

export function useNotificationPreferences(realm: NotificationRealm) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationKeys.preferences(realm),
    queryFn: () => notificationApi.getPreferences(realm),
  });

  const update = useMutation({
    mutationFn: (preferences: { category: NotificationCategory; inApp: boolean; email: boolean }[]) =>
      notificationApi.updatePreferences(realm, preferences),
    onSuccess: (data) => queryClient.setQueryData(notificationKeys.preferences(realm), data),
  });

  return {
    preferences: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    update: update.mutate,
    isUpdating: update.isPending,
  };
}
