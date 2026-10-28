import { z } from 'zod';

export const rejectWorkItemSchema = z.object({
  reason: z.string().trim().min(1, 'Pick a reason or write your own'),
  detail: z.string().trim().max(500, 'Keep the note under 500 characters').optional(),
});

export type RejectWorkItemFormData = z.infer<typeof rejectWorkItemSchema>;
