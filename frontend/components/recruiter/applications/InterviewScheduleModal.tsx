'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { interviewScheduleSchema, type InterviewScheduleFormData } from '@/schemas/application.schema';
import type { ApplicationInterview } from '@/types/recruiter-application';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CalendarClock, Video } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

interface InterviewScheduleModalProps {
  candidateName: string;
  jobTitle: string;
  onClose: () => void;
  onConfirm: (interview: ApplicationInterview) => void;
}

const MODE_CHOICES = [
  { value: 'ONLINE' as const, label: 'Online interview', icon: Video },
  { value: 'OFFLINE' as const, label: 'On-site interview', icon: Building2 },
];

export default function InterviewScheduleModal({
  candidateName,
  jobTitle,
  onClose,
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
      title="Schedule the interview"
      description={`${candidateName} — ${jobTitle}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(submit)}>Save schedule and move to Interview</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50/60 p-3">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
          <p className="text-[11.5px] leading-relaxed text-violet-900">
            The application moves to <strong>Interview</strong> only after the schedule is saved. If you cancel, the
            current status stays unchanged.
          </p>
        </div>

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
          <Input type="date" label="Interview date" error={formState.errors.date?.message} {...register('date')} />
          <Input type="time" label="Start time" error={formState.errors.time?.message} {...register('time')} />
        </div>

        {mode === 'ONLINE' ? (
          <Input
            label="Online meeting link"
            placeholder="https://meet.google.com/..."
            error={formState.errors.meetingUrl?.message}
            {...register('meetingUrl')}
          />
        ) : (
          <Input
            label="Interview location"
            placeholder="Floor 12, Keangnam Tower, Nam Tu Liem, Hanoi"
            error={formState.errors.location?.message}
            {...register('location')}
          />
        )}

        <Textarea
          label="Interview notes"
          rows={3}
          placeholder="60-minute technical round with live coding..."
          error={formState.errors.note?.message}
          {...register('note')}
        />
      </div>
    </Modal>
  );
}
