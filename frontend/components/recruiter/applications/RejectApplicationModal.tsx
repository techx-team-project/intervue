'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { REJECTION_REASON_PRESETS } from '@/constants/application-status';
import { cn } from '@/lib/utils';
import { rejectApplicationSchema, type RejectApplicationFormData } from '@/schemas/application.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface RejectApplicationModalProps {
  candidateNames: string[];
  initialStatus?: RejectApplicationFormData['status'];
  onClose: () => void;
  onConfirm: (data: RejectApplicationFormData) => void;
}

const STATUS_CHOICES: { value: RejectApplicationFormData['status']; label: string; description: string }[] = [
  {
    value: 'REJECTED',
    label: 'Từ chối hồ sơ',
    description: 'Nhà tuyển dụng quyết định không tiếp tục với ứng viên',
  },
  {
    value: 'NO_AGREEMENT',
    label: 'Không thỏa thuận được',
    description: 'Hai bên không thống nhất được điều kiện làm việc',
  },
];

export default function RejectApplicationModal({
  candidateNames,
  initialStatus = 'REJECTED',
  onClose,
  onConfirm,
}: RejectApplicationModalProps) {
  const [isCustomReason, setIsCustomReason] = useState(false);
  const { register, handleSubmit, setValue, control, formState } = useForm<RejectApplicationFormData>({
    resolver: zodResolver(rejectApplicationSchema),
    defaultValues: { status: initialStatus, reason: '', detail: '' },
  });

  const status = useWatch({ control, name: 'status' });
  const reason = useWatch({ control, name: 'reason' });

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title="Kết thúc hồ sơ ứng tuyển"
      description={
        candidateNames.length === 1
          ? `Hồ sơ của ${candidateNames[0]} sẽ chuyển sang nhóm đã kết thúc.`
          : `${candidateNames.length} hồ sơ sẽ chuyển sang nhóm đã kết thúc.`
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={handleSubmit(onConfirm)}>
            Xác nhận kết thúc
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {STATUS_CHOICES.map((choice) => (
            <button
              key={choice.value}
              type="button"
              onClick={() => setValue('status', choice.value)}
              className={cn(
                'cursor-pointer rounded-2xl border p-3.5 text-left transition',
                status === choice.value
                  ? 'border-rose-300 bg-rose-50/60 ring-1 ring-rose-200'
                  : 'border-slate-200 bg-white hover:border-slate-300',
              )}
            >
              <p className="text-navy text-[13.5px] font-bold">{choice.label}</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[#64748b]">{choice.description}</p>
            </button>
          ))}
        </div>

        <div>
          <p className="text-navy mb-2 text-[13px] font-bold">
            Lý do <span className="text-rose-500">*</span>
          </p>

          <div className="space-y-2">
            {REJECTION_REASON_PRESETS.map((preset) => (
              <label
                key={preset}
                className={cn(
                  'flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-[12.5px] transition',
                  !isCustomReason && reason === preset
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300',
                )}
              >
                <input
                  type="radio"
                  name="rejection-reason-preset"
                  checked={!isCustomReason && reason === preset}
                  onChange={() => {
                    setIsCustomReason(false);
                    setValue('reason', preset, { shouldValidate: true });
                  }}
                  className="mt-0.5 h-4 w-4 cursor-pointer border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700">{preset}</span>
              </label>
            ))}

            <label
              className={cn(
                'flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-[12.5px] transition',
                isCustomReason ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <input
                type="radio"
                name="rejection-reason-preset"
                checked={isCustomReason}
                onChange={() => {
                  setIsCustomReason(true);
                  setValue('reason', '', { shouldValidate: false });
                }}
                className="mt-0.5 h-4 w-4 cursor-pointer border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-slate-700">Lý do khác</span>
            </label>
          </div>

          {isCustomReason && (
            <div className="mt-2.5">
              <Input placeholder="Nhập lý do kết thúc hồ sơ" {...register('reason')} />
            </div>
          )}

          {formState.errors.reason && (
            <p className="mt-1.5 text-xs font-medium text-rose-500">{formState.errors.reason.message}</p>
          )}
        </div>

        <Textarea
          label="Ghi chú nội bộ (không gửi cho ứng viên)"
          rows={3}
          placeholder="Ghi lại bối cảnh để đồng nghiệp hiểu quyết định này..."
          error={formState.errors.detail?.message}
          {...register('detail')}
        />

        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-[11.5px] leading-relaxed text-amber-800">
            Quyết định kết thúc hồ sơ do nhà tuyển dụng đưa ra. InterVue AI chỉ đưa ra gợi ý và không tự động từ chối
            bất kỳ ứng viên nào.
          </p>
        </div>
      </div>
    </Modal>
  );
}
