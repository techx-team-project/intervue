import { z } from 'zod';

export const sendInvitationSchema = z.object({
  candidateId: z.number({ error: 'Please select a candidate.' }),
  message: z
    .string()
    .trim()
    .min(1, 'Please write an opening message.')
    .max(1000, 'Message must be at most 1000 characters.'),
});

export type SendInvitationFormValues = z.infer<typeof sendInvitationSchema>;

export const sendMessageSchema = z.object({
  body: z.string().trim().min(1, 'Please enter a message.').max(2000, 'Message must be at most 2000 characters.'),
});

export type SendMessageFormValues = z.infer<typeof sendMessageSchema>;

export const editMessageSchema = sendMessageSchema;

export type EditMessageFormValues = z.infer<typeof editMessageSchema>;

export const reportConversationSchema = z.object({
  reasonCode: z.enum(['SCAM', 'HARASSMENT', 'SPAM', 'INAPPROPRIATE', 'OTHER'], {
    error: 'Please select a reason.',
  }),
  reasonNote: z.string().trim().max(1000, 'Note must be at most 1000 characters.').optional(),
});

export type ReportConversationFormValues = z.infer<typeof reportConversationSchema>;
