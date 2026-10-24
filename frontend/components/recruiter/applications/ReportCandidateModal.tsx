'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { reportCandidateSchema, type ReportCandidateFormData } from '@/schemas/application.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ReportCandidateModalProps {
  candidateName: string;
  onClose: () => void;
  onConfirm: (data: ReportCandidateFormData) => void;
}

const REPORT_REASON_OPTIONS = [
  { value: '', label: 'Select a reason' },
  { value: 'FAKE_PROFILE', label: 'Fake profile or inaccurate information' },
  { value: 'SPAM', label: 'Mass spam applications' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate CV content' },
  { value: 'IMPERSONATION', label: 'Impersonating someone else' },
  { value: 'OTHER', label: 'Other reason' },
];

export default function ReportCandidateModal({ candidateName, onClose, onConfirm }: ReportCandidateModalProps) {
  const { register, handleSubmit, formState } = useForm<ReportCandidateFormData>({
    resolver: zodResolver(reportCandidateSchema),
    defaultValues: { reason: '', detail: '' },
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="md"
      title="Report candidate"
      description={`Your report about ${candidateName} will be sent to the InterVue moderation team.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit(onConfirm)}>
            Send report
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Reason for reporting"
          options={REPORT_REASON_OPTIONS}
          error={formState.errors.reason?.message}
          {...register('reason')}
        />

        <Textarea
          label="Details"
          rows={4}
          placeholder="Describe exactly what is wrong with this application..."
          error={formState.errors.detail?.message}
          {...register('detail')}
        />

        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="text-[11.5px] leading-relaxed text-slate-600">
            False reports can affect the reputation of your recruiter account. Please report only when you have clear
            grounds.
          </p>
        </div>
      </div>
    </Modal>
  );
}
