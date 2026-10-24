import { z } from 'zod';

export const rejectApplicationSchema = z.object({
  status: z.enum(['REJECTED', 'NO_AGREEMENT']),
  reason: z.string().trim().min(5, 'Please pick or enter a reason for closing this application.').max(200),
  detail: z.string().trim().max(500, 'The note must be at most 500 characters.').optional(),
});

export const interviewScheduleSchema = z
  .object({
    date: z.string().min(1, 'Please pick an interview date.'),
    time: z.string().min(1, 'Please pick an interview time.'),
    mode: z.enum(['ONLINE', 'OFFLINE']),
    location: z.string().trim().max(200).optional(),
    meetingUrl: z.string().trim().max(300).optional(),
    note: z.string().trim().max(300, 'The note must be at most 300 characters.').optional(),
  })
  .refine((data) => data.mode !== 'OFFLINE' || (data.location ?? '').length > 0, {
    message: 'Please enter the interview location.',
    path: ['location'],
  })
  .refine((data) => data.mode !== 'ONLINE' || (data.meetingUrl ?? '').length > 0, {
    message: 'Please enter the online meeting link.',
    path: ['meetingUrl'],
  });

export const reportCandidateSchema = z.object({
  reason: z.string().min(1, 'Please pick a reason for reporting.'),
  detail: z.string().trim().min(10, 'Please describe the issue in at least 10 characters.').max(500),
});

export type RejectApplicationFormData = z.infer<typeof rejectApplicationSchema>;
export type InterviewScheduleFormData = z.infer<typeof interviewScheduleSchema>;
export type ReportCandidateFormData = z.infer<typeof reportCandidateSchema>;
