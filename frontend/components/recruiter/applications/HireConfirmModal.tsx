'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { CheckCircle2, Info } from 'lucide-react';

interface HireConfirmModalProps {
  candidateNames: string[];
  jobTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function HireConfirmModal({ candidateNames, jobTitle, onClose, onConfirm }: HireConfirmModalProps) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="md"
      title="Confirm the candidate was hired"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button leftIcon={<CheckCircle2 className="h-4 w-4" />} onClick={onConfirm}>
            Confirm hire
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-navy text-[13.5px] font-bold">
            {candidateNames.length === 1 ? candidateNames[0] : `${candidateNames.length} candidates`}
          </p>
          <p className="mt-0.5 text-[12px] text-[#64748b]">Role: {jobTitle}</p>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/70 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
          <p className="text-[11.5px] leading-relaxed text-sky-900">
            A hire only counts once the candidate confirms it too. After you confirm, InterVue sends a confirmation
            request to the candidate.
          </p>
        </div>
      </div>
    </Modal>
  );
}
