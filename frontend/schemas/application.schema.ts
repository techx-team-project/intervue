import { z } from 'zod';

export const rejectApplicationSchema = z.object({
  status: z.enum(['REJECTED', 'NO_AGREEMENT']),
  reason: z.string().trim().min(5, 'Vui lòng chọn hoặc nhập lý do kết thúc hồ sơ.').max(200),
  detail: z.string().trim().max(500, 'Ghi chú tối đa 500 ký tự.').optional(),
});

export const interviewScheduleSchema = z
  .object({
    date: z.string().min(1, 'Vui lòng chọn ngày phỏng vấn.'),
    time: z.string().min(1, 'Vui lòng chọn giờ phỏng vấn.'),
    mode: z.enum(['ONLINE', 'OFFLINE']),
    location: z.string().trim().max(200).optional(),
    meetingUrl: z.string().trim().max(300).optional(),
    note: z.string().trim().max(300, 'Ghi chú tối đa 300 ký tự.').optional(),
  })
  .refine((data) => data.mode !== 'OFFLINE' || (data.location ?? '').length > 0, {
    message: 'Vui lòng nhập địa điểm phỏng vấn.',
    path: ['location'],
  })
  .refine((data) => data.mode !== 'ONLINE' || (data.meetingUrl ?? '').length > 0, {
    message: 'Vui lòng nhập liên kết họp trực tuyến.',
    path: ['meetingUrl'],
  });

export const reportCandidateSchema = z.object({
  reason: z.string().min(1, 'Vui lòng chọn lý do báo cáo.'),
  detail: z.string().trim().min(10, 'Vui lòng mô tả chi tiết ít nhất 10 ký tự.').max(500),
});

export type RejectApplicationFormData = z.infer<typeof rejectApplicationSchema>;
export type InterviewScheduleFormData = z.infer<typeof interviewScheduleSchema>;
export type ReportCandidateFormData = z.infer<typeof reportCandidateSchema>;
