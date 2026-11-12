import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminDismissReportPayload,
  AdminReportDetail,
  AdminReportSummary,
  AdminResolveReportPayload,
  ConnectFilterWord,
  CreateFilterWordPayload,
  FilterScope,
  ReportStatus,
  ReportTargetType,
  UpdateFilterWordPayload,
} from '@/types/admin-moderation';
import type { ConnectMessage } from '@/types/connect';

function toQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

export const adminModerationApi = {
  // Reports
  reports: (params: { targetType?: ReportTargetType; status?: ReportStatus; page: number; size: number }) =>
    request<Page<AdminReportSummary>>(`/admin/reports?${toQuery(params)}`),

  reportDetail: (id: number) => request<AdminReportDetail>(`/admin/reports/${id}`),

  dismissReport: (id: number, payload: AdminDismissReportPayload) =>
    request<null>(`/admin/reports/${id}/dismiss`, { method: 'POST', body: payload }),

  resolveReport: (id: number, payload: AdminResolveReportPayload) =>
    request<null>(`/admin/reports/${id}/resolve`, { method: 'POST', body: payload }),

  conversationMessages: (connectionId: number, page = 0, size = 50) =>
    request<Page<ConnectMessage>>(`/admin/connect/conversations/${connectionId}/messages?${toQuery({ page, size })}`),

  // Filter Words
  filterWords: (scope: FilterScope, page = 0, size = 50) =>
    request<Page<ConnectFilterWord>>(`/admin/connect/filter-words?${toQuery({ scope, page, size })}`),

  createFilterWord: (payload: CreateFilterWordPayload) =>
    request<ConnectFilterWord>('/admin/connect/filter-words', { method: 'POST', body: payload }),

  updateFilterWord: (id: number, payload: UpdateFilterWordPayload) =>
    request<ConnectFilterWord>(`/admin/connect/filter-words/${id}`, { method: 'PUT', body: payload }),

  deleteFilterWord: (id: number) => request<null>(`/admin/connect/filter-words/${id}`, { method: 'DELETE' }),

  toggleFilterWord: (id: number) =>
    request<ConnectFilterWord>(`/admin/connect/filter-words/${id}/toggle`, { method: 'PATCH' }),
};
