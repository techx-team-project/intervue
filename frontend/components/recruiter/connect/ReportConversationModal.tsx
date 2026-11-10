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
  { value: 'SCAM', label: 'Lừa đảo' },
  { value: 'HARASSMENT', label: 'Quấy rối' },
  { value: 'SPAM', label: 'Tin nhắn rác' },
  { value: 'INAPPROPRIATE', label: 'Nội dung không phù hợp' },
  { value: 'OTHER', label: 'Khác' },
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
          toast.success('Báo cáo của bạn đã được gửi.');
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
      title="Báo cáo cuộc trò chuyện"
      description="Quản trị viên sẽ xem xét và thông báo kết quả cho bạn."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={report.isPending}>
            Gửi báo cáo
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
          label="Ghi chú (không bắt buộc)"
          placeholder="Mô tả thêm về vấn đề bạn gặp phải..."
          rows={3}
          {...register('reasonNote')}
        />
      </form>
    </Modal>
  );
}
