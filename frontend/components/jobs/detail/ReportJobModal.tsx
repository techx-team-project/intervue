'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useReportJob } from '@/hooks/useReportJob';
import type { ReportReasonCode } from '@/types/connect';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import { toast } from 'sonner';

const NOTE_MAX_LENGTH = 500;

const REASONS: Array<{ value: ReportReasonCode; label: string; hint: string }> = [
  { value: 'SCAM', label: 'Scam or fraud', hint: 'Asks for money, deposits or personal documents.' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate content', hint: 'Discriminatory, offensive or adult content.' },
  { value: 'SPAM', label: 'Spam or advertising', hint: 'Not a real job, or a repeated post.' },
  { value: 'HARASSMENT', label: 'Harassment or abuse', hint: 'Targets or insults a person or group.' },
  { value: 'OTHER', label: 'Something else', hint: 'Tell us more below.' },
];

type ReportJobModalProps = {
  jobId: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function ReportJobModal({ jobId, isOpen, onClose }: ReportJobModalProps) {
  const [reason, setReason] = useState<ReportReasonCode>('SCAM');
  const [note, setNote] = useState('');
  const report = useReportJob(jobId);

  const close = () => {
    setReason('SCAM');
    setNote('');
    onClose();
  };

  const submit = () => {
    report.mutate(
      { reasonCode: reason, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Thanks. Our team will review this job.');
          close();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Report this job"
      description="Tell us what is wrong. Reports are reviewed by our team."
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={report.isPending}>
            Send report
          </Button>
        </div>
      }
    >
      <fieldset className="space-y-2">
        <legend className="sr-only">Reason</legend>
        {REASONS.map((option) => (
          <label
            key={option.value}
            className="border-outline-variant has-[:checked]:border-primary has-[:checked]:bg-primary-light flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors"
          >
            <input
              type="radio"
              name="report-reason"
              value={option.value}
              checked={reason === option.value}
              onChange={() => setReason(option.value)}
              className="accent-primary mt-1"
            />
            <span>
              <span className="text-on-surface block text-sm font-semibold">{option.label}</span>
              <span className="text-on-surface-variant block text-xs">{option.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="mt-4">
        <Textarea
          label="Details (optional)"
          rows={3}
          maxLength={NOTE_MAX_LENGTH}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          helperText={`${note.length}/${NOTE_MAX_LENGTH}`}
        />
      </div>
    </Modal>
  );
}
