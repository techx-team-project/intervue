import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdBooking,
  AdSlot,
  AdSlotCalendar,
  AdminAdCreative,
  AdCreativeStatus,
  CreateAdSlotInput,
  SaveAdSlotInput,
  ServedAd,
} from '@/types/ads';

export const publicAdApi = {
  serve: (code: string) => request<ServedAd | null>(`/ads/slots/${code}`),

  click: (code: string) => request<null>(`/ads/slots/${code}/click`, { method: 'POST' }),
};

export const recruiterAdApi = {
  slots: () => request<AdSlot[]>('/recruiter/ads/slots'),

  calendar: (code: string, weeks: number) =>
    request<AdSlotCalendar>(`/recruiter/ads/slots/${code}/calendar?weeks=${weeks}`),

  bookings: () => request<AdBooking[]>('/recruiter/ads/bookings'),

  uploadCreative: (bookingId: number, file: File, targetUrl: string, altText: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('data', new Blob([JSON.stringify({ targetUrl, altText })], { type: 'application/json' }));
    return request<AdBooking>(`/recruiter/ads/bookings/${bookingId}/creative`, { method: 'POST', body: form });
  },
};

export const adminAdApi = {
  slots: () => request<AdSlot[]>('/admin/ads/slots'),

  createSlot: (data: CreateAdSlotInput) => request<AdSlot>('/admin/ads/slots', { method: 'POST', body: data }),

  updateSlot: (id: number, data: SaveAdSlotInput) =>
    request<AdSlot>(`/admin/ads/slots/${id}`, { method: 'PUT', body: data }),

  uploadHouseImage: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<{ url: string; publicId: string }>('/admin/ads/upload-image', { method: 'POST', body: form });
  },

  creatives: (status: AdCreativeStatus | '', page: number, size: number) =>
    request<Page<AdminAdCreative>>(
      `/admin/ads/creatives?${new URLSearchParams({
        ...(status ? { status } : {}),
        page: String(page),
        size: String(size),
      })}`,
    ),

  approve: (id: number) => request<AdminAdCreative>(`/admin/ads/creatives/${id}/approve`, { method: 'POST' }),

  reject: (id: number, rejectionReason: string) =>
    request<AdminAdCreative>(`/admin/ads/creatives/${id}/reject`, { method: 'POST', body: { rejectionReason } }),
};
