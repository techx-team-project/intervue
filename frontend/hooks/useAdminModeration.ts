import { adminModerationApi } from '@/apiRequest/admin-moderation';
import type {
  AdminDismissReportPayload,
  AdminResolveReportPayload,
  CreateFilterWordPayload,
  FilterScope,
  ReportStatus,
  ReportTargetType,
  UpdateFilterWordPayload,
} from '@/types/admin-moderation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const adminModerationKeys = {
  all: ['admin', 'moderation'] as const,
  reports: (params: { targetType?: ReportTargetType; status?: ReportStatus; page: number; size: number }) =>
    ['admin', 'moderation', 'reports', params] as const,
  reportDetail: (id: number) => ['admin', 'moderation', 'report', id] as const,
  conversationMessages: (connectionId: number, page: number, size: number) =>
    ['admin', 'moderation', 'conversation-messages', connectionId, page, size] as const,
  filterWords: (scope: FilterScope, page: number, size: number) =>
    ['admin', 'moderation', 'filter-words', scope, page, size] as const,
};

export function useAdminReports(params: {
  targetType?: ReportTargetType;
  status?: ReportStatus;
  page: number;
  size: number;
}) {
  return useQuery({
    queryKey: adminModerationKeys.reports(params),
    queryFn: () => adminModerationApi.reports(params),
  });
}

export function useAdminReportDetail(id?: number) {
  return useQuery({
    queryKey: id ? adminModerationKeys.reportDetail(id) : ['admin', 'moderation', 'report', 'disabled'],
    queryFn: () => adminModerationApi.reportDetail(id!),
    enabled: typeof id === 'number' && id > 0,
  });
}

export function useAdminReportConversationMessages(connectionId?: number, page = 0, size = 50) {
  return useQuery({
    queryKey: connectionId
      ? adminModerationKeys.conversationMessages(connectionId, page, size)
      : ['admin', 'moderation', 'messages', 'disabled'],
    queryFn: () => adminModerationApi.conversationMessages(connectionId!, page, size),
    enabled: typeof connectionId === 'number' && connectionId > 0,
  });
}

export function useAdminDismissReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminDismissReportPayload }) =>
      adminModerationApi.dismissReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminModerationKeys.all });
    },
  });
}

export function useAdminResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminResolveReportPayload }) =>
      adminModerationApi.resolveReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminModerationKeys.all });
    },
  });
}

export function useAdminFilterWords(scope: FilterScope, page = 0, size = 50) {
  return useQuery({
    queryKey: adminModerationKeys.filterWords(scope, page, size),
    queryFn: () => adminModerationApi.filterWords(scope, page, size),
  });
}

export function useAdminCreateFilterWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFilterWordPayload) => adminModerationApi.createFilterWord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminModerationKeys.all });
    },
  });
}

export function useAdminUpdateFilterWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateFilterWordPayload }) =>
      adminModerationApi.updateFilterWord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminModerationKeys.all });
    },
  });
}

export function useAdminDeleteFilterWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminModerationApi.deleteFilterWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminModerationKeys.all });
    },
  });
}

export function useAdminToggleFilterWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminModerationApi.toggleFilterWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminModerationKeys.all });
    },
  });
}
