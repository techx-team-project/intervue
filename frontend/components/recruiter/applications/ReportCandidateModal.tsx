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
  { value: '', label: 'Chọn lý do báo cáo' },
  { value: 'FAKE_PROFILE', label: 'Hồ sơ giả mạo hoặc thông tin không đúng' },
  { value: 'SPAM', label: 'Ứng tuyển spam hàng loạt' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Nội dung CV không phù hợp' },
  { value: 'IMPERSONATION', label: 'Mạo danh người khác' },
  { value: 'OTHER', label: 'Lý do khác' },
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
      title="Báo cáo ứng viên"
      description={`Báo cáo về hồ sơ của ${candidateName} sẽ được gửi tới đội ngũ kiểm duyệt InterVue.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={handleSubmit(onConfirm)}>
            Gửi báo cáo
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Lý do báo cáo"
          options={REPORT_REASON_OPTIONS}
          error={formState.errors.reason?.message}
          {...register('reason')}
        />

        <Textarea
          label="Mô tả chi tiết"
          rows={4}
          placeholder="Mô tả cụ thể vấn đề bạn gặp phải với hồ sơ này..."
          error={formState.errors.detail?.message}
          {...register('detail')}
        />

        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="text-[11.5px] leading-relaxed text-slate-600">
            Báo cáo sai sự thật có thể ảnh hưởng tới uy tín tài khoản nhà tuyển dụng của bạn. Vui lòng chỉ báo cáo khi
            có căn cứ rõ ràng.
          </p>
        </div>
      </div>
    </Modal>
  );
}
