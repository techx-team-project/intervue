'use client';

import { recruiterAdApi } from '@/apiRequest/ads';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const adKeys = {
  slots: ['recruiter', 'ads', 'slots'] as const,
  calendar: (code: string, weeks: number) => ['recruiter', 'ads', 'calendar', code, weeks] as const,
  bookings: ['recruiter', 'ads', 'bookings'] as const,
};

export function useAdSlots() {
  return useQuery({ queryKey: adKeys.slots, queryFn: recruiterAdApi.slots });
}

export function useAdCalendar(code: string | null, weeks: number) {
  return useQuery({
    queryKey: adKeys.calendar(code ?? '', weeks),
    queryFn: () => recruiterAdApi.calendar(code as string, weeks),
    enabled: code !== null,
  });
}

export function useAdBookings() {
  return useQuery({ queryKey: adKeys.bookings, queryFn: recruiterAdApi.bookings });
}

export function useUploadAdCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      file,
      targetUrl,
      altText,
    }: {
      bookingId: number;
      file: File;
      targetUrl: string;
      altText: string;
    }) => recruiterAdApi.uploadCreative(bookingId, file, targetUrl, altText),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adKeys.bookings }),
  });
}
