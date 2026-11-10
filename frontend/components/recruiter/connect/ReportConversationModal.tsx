'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useReportConversation } from '@/hooks/useRecruiterConnect';
import { reportConversationSchema, type ReportConversationFormValues } from '@/schemas/connect.schema';
import { cn } from '@/lib/utils';
import type { ReportReasonCode } from '@/types/connect';
import { getErrorMessage } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const FORM_ID = 'report-conversation-form';

const REASON_OPTIONS: { value: ReportReasonCode; label: string }[] = [
  { value: 'SCAM', label: 'Scam or fraud' },
  { value: 'HARASSMENT', label: 'Harassment or abuse' },
  { value: 'SPAM', label: 'Spam or automated messages' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate content' },
  { value: 'OTHER', label: 'Other' },
];

type ReportConversationModalProps = {
  connectionId: number;
  onClose: () => void;
};

export default function ReportConversationModal({ connectionId, onClose }: ReportConversationModalProps) {
  const report = useReportConversation(connectionId);
  const { control, register, handleSubmit } = useForm<ReportConversationFormValues>({
    resolver: zodResolver(reportConversationSchema),
    defaultValues: { reasonCode: 'OTHER', reasonNote: '' },
  });

  const onSubmit = (values: ReportConversationFormValues) => {
    report.mutate(
      { reasonCode: values.reasonCode, reasonNote: values.reasonNote },
      {
        onSuccess: () => {
          toast.success('Your report has been submitted.');
          onClose();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Report conversation"
      description="An administrator will review this report and take appropriate action."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={report.isPending}>
            Submit report
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Controller
          control={control}
          name="reasonCode"
          render={({ field }) => (
            <div className="space-y-1.5">
              {REASON_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors',
                    field.value === option.value
                      ? 'border-primary bg-primary-light text-on-primary-container'
                      : 'border-outline-variant hover:bg-surface-container-low',
                  )}
                >
                  <input
                    type="radio"
                    name="reasonCode"
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="accent-primary"
                  />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />

        <Textarea
          label="Notes (optional)"
          placeholder="Describe the issue you encountered..."
          rows={3}
          {...register('reasonNote')}
        />
      </form>
    </Modal>
  );
}
