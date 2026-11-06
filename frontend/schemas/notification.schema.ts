import { z } from 'zod';

export const broadcastSchema = z.object({
  audience: z.enum(['CANDIDATE', 'RECRUITER', 'ADMIN']),
  severity: z.enum(['INFO', 'SUCCESS', 'WARNING', 'DANGER']),
  title: z.string().trim().min(1, 'Title is required').max(255, 'Title must be 255 characters or fewer'),
  summary: z.string().trim().min(1, 'Summary is required').max(500, 'Summary must be 500 characters or fewer'),
  bodyMarkdown: z.string().trim().min(1, 'Body is required'),
  actionUrl: z.string().trim().max(500, 'Action URL is too long').optional(),
  actionLabel: z.string().trim().max(100, 'Action label is too long').optional(),
  scheduledAt: z.string().optional(),
});

export type BroadcastFormValues = z.infer<typeof broadcastSchema>;
