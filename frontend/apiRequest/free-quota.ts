import { request } from '@/apiRequest/http';
import type { FreeQuotaSettings, SaveFreeQuotaSettingsInput } from '@/types/free-quota';

export const adminFreeQuotaApi = {
  get: () => request<FreeQuotaSettings>('/admin/free-quotas'),

  update: (data: SaveFreeQuotaSettingsInput) =>
    request<FreeQuotaSettings>('/admin/free-quotas', { method: 'PUT', body: data }),
};
