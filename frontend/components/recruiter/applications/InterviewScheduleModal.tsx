'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { interviewScheduleSchema, type InterviewScheduleFormData } from '@/schemas/application.schema';
import type { ApplicationInterview } from '@/types/recruiter-application';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Video } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

interface InterviewScheduleModalProps {
  candidateName: string;
  jobTitle: string;
  onClose: () => void;
  onSkip: () => void;
  onConfirm: (interview: ApplicationInterview) => void;
}

const MODE_CHOICES = [
  { value: 'ONLINE' as const, label: 'Phỏng vấn online', icon: Video },
  { value: 'OFFLINE' as const, label: 'Phỏng vấn tại công ty', icon: Building2 },
];

export default function InterviewScheduleModal({
  candidateName,
  jobTitle,
  onClose,
  onSkip,
  onConfirm,
}: InterviewScheduleModalProps) {
  const { register, handleSubmit, setValue, control, formState } = useForm<InterviewScheduleFormData>({
    resolver: zodResolver(interviewScheduleSchema),
    defaultValues: { date: '', time: '09:00', mode: 'ONLINE', location: '', meetingUrl: '', note: '' },
  });

  const mode = useWatch({ control, name: 'mode' });

  const submit = (data: InterviewScheduleFormData) => {
    onConfirm({
      scheduledAt: new Date(`${data.date}T${data.time}:00+07:00`).toISOString(),
      mode: data.mode,
      location: data.mode === 'OFFLINE' ? data.location : undefined,
      meetingUrl: data.mode === 'ONLINE' ? data.meetingUrl : undefined,
      note: data.note,
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title="Đặt lịch phỏng vấn"
      description={`${candidateName} — ${jobTitle}`}
      footer={
        <>
          <Button variant="ghost" onClick={onSkip}>
            Chuyển trạng thái, đặt lịch sau
          </Button>
          <Button onClick={handleSubmit(submit)}>Lưu lịch phỏng vấn</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {MODE_CHOICES.map((choice) => {
            const Icon = choice.icon;

            return (
              <button
                key={choice.value}
                type="button"
                onClick={() => setValue('mode', choice.value)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-2xl border p-3.5 text-left transition',
                  mode === choice.value
                    ? 'border-primary bg-primary-light ring-primary/25 ring-1'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                )}
              >
                <Icon className={cn('h-4 w-4', mode === choice.value ? 'text-primary' : 'text-slate-400')} />
                <span className="text-navy text-[13px] font-bold">{choice.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input type="date" label="Ngày phỏng vấn" error={formState.errors.date?.message} {...register('date')} />
          <Input type="time" label="Giờ bắt đầu" error={formState.errors.time?.message} {...register('time')} />
        </div>

        {mode === 'ONLINE' ? (
          <Input
            label="Liên kết họp trực tuyến"
            placeholder="https://meet.google.com/..."
            error={formState.errors.meetingUrl?.message}
            {...register('meetingUrl')}
          />
        ) : (
          <Input
            label="Địa điểm phỏng vấn"
            placeholder="Tầng 12, toà Keangnam, Nam Từ Liêm, Hà Nội"
            error={formState.errors.location?.message}
            {...register('location')}
          />
        )}

        <Textarea
          label="Ghi chú cho buổi phỏng vấn"
          rows={3}
          placeholder="Vòng kỹ thuật 60 phút, có phần live coding..."
          error={formState.errors.note?.message}
          {...register('note')}
        />
      </div>
    </Modal>
  );
}
