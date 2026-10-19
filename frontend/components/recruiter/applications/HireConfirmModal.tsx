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
      title="Xác nhận ứng viên nhận việc"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Huỷ
          </Button>
          <Button leftIcon={<CheckCircle2 className="h-4 w-4" />} onClick={onConfirm}>
            Xác nhận đã tuyển
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-navy text-[13.5px] font-bold">
            {candidateNames.length === 1 ? candidateNames[0] : `${candidateNames.length} ứng viên`}
          </p>
          <p className="mt-0.5 text-[12px] text-[#64748b]">Vị trí: {jobTitle}</p>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/70 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
          <p className="text-[11.5px] leading-relaxed text-sky-900">
            Hồ sơ chỉ được tính là tuyển thành công khi ứng viên cũng xác nhận nhận việc. Sau khi bạn xác nhận, InterVue
            sẽ gửi yêu cầu xác nhận tới ứng viên.
          </p>
        </div>
      </div>
    </Modal>
  );
}
