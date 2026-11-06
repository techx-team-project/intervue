import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminBroadcastResource,
  AudiencePreviewResource,
  BroadcastAudience,
  BroadcastInput,
  BroadcastStatus,
  NotificationCategory,
  NotificationDetailResource,
  NotificationListResource,
  NotificationPreferenceResource,
  NotificationRealm,
  UnreadCountResource,
} from '@/types/notification';

export interface NotificationSearchParams {
  category?: NotificationCategory;
  unreadOnly?: boolean;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface BroadcastSearchParams {
  status?: BroadcastStatus;
  audience?: BroadcastAudience;
  q?: string;
  page?: number;
  size?: number;
}

function basePath(realm: NotificationRealm): string {
  return realm === 'recruiter' ? '/recruiter/notifications' : '/notifications';
}

function toQuery(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    qs.set(key, String(value));
  });
  const query = qs.toString();
  return query ? `?${query}` : '';
}

export const notificationApi = {
  search: (realm: NotificationRealm, params: NotificationSearchParams = {}) =>
    request<Page<NotificationListResource>>(`${basePath(realm)}${toQuery({ ...params })}`),

  unreadCount: (realm: NotificationRealm) => request<UnreadCountResource>(`${basePath(realm)}/unread-count`),

  getById: (realm: NotificationRealm, id: number) => request<NotificationDetailResource>(`${basePath(realm)}/${id}`),

  markRead: (realm: NotificationRealm, id: number) =>
    request<void>(`${basePath(realm)}/${id}/read`, { method: 'POST' }),

  markAllRead: (realm: NotificationRealm, category?: NotificationCategory) =>
    request<number>(`${basePath(realm)}/read-all`, {
      method: 'POST',
      body: { category: category ?? null },
    }),

  markAllSeen: (realm: NotificationRealm) => request<number>(`${basePath(realm)}/seen`, { method: 'POST' }),

  archive: (realm: NotificationRealm, id: number) => request<void>(`${basePath(realm)}/${id}`, { method: 'DELETE' }),

  getPreferences: (realm: NotificationRealm) =>
    request<NotificationPreferenceResource[]>(`${basePath(realm)}/preferences`),

  updatePreferences: (
    realm: NotificationRealm,
    preferences: Pick<NotificationPreferenceResource, 'category' | 'inApp' | 'email'>[],
  ) =>
    request<NotificationPreferenceResource[]>(`${basePath(realm)}/preferences`, {
      method: 'PUT',
      body: { preferences },
    }),
};

export const adminBroadcastApi = {
  search: (params: BroadcastSearchParams = {}) =>
    request<Page<AdminBroadcastResource>>(`/admin/notifications/broadcasts${toQuery({ ...params })}`),

  getById: (id: number) => request<AdminBroadcastResource>(`/admin/notifications/broadcasts/${id}`),

  create: (data: BroadcastInput) =>
    request<AdminBroadcastResource>('/admin/notifications/broadcasts', { method: 'POST', body: data }),

  update: (id: number, data: BroadcastInput) =>
    request<AdminBroadcastResource>(`/admin/notifications/broadcasts/${id}`, { method: 'PUT', body: data }),

  remove: (id: number) => request<void>(`/admin/notifications/broadcasts/${id}`, { method: 'DELETE' }),

  previewAudience: (id: number) =>
    request<AudiencePreviewResource>(`/admin/notifications/broadcasts/${id}/audience-preview`),

  send: (id: number) =>
    request<AdminBroadcastResource>(`/admin/notifications/broadcasts/${id}/send`, { method: 'POST' }),

  cancel: (id: number) =>
    request<AdminBroadcastResource>(`/admin/notifications/broadcasts/${id}/cancel`, { method: 'POST' }),
};
