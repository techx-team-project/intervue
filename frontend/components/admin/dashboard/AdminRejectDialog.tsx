'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { REJECTION_REASON_PRESETS, WORK_ITEM_KIND_LABEL } from '@/constants/admin-work';
import { cn } from '@/lib/utils';
import { rejectWorkItemSchema, type RejectWorkItemFormData } from '@/schemas/admin.schema';
import type { AdminWorkItem } from '@/types/admin';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollText } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

interface AdminRejectDialogProps {
  item: AdminWorkItem;
  onClose: () => void;
  onConfirm: (data: RejectWorkItemFormData) => void;
}

export default function AdminRejectDialog({ item, onClose, onConfirm }: AdminRejectDialogProps) {
  const { handleSubmit, setValue, register, control, formState } = useForm<RejectWorkItemFormData>({
    resolver: zodResolver(rejectWorkItemSchema),
    defaultValues: { reason: '', detail: '' },
  });

  const reason = useWatch({ control, name: 'reason' });
  const presets = REJECTION_REASON_PRESETS[item.kind];

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="lg"
      title={`Reject — ${item.subject}`}
      description={`${WORK_ITEM_KIND_LABEL[item.kind]} · the reason is sent to the user and recorded in the audit log.`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onConfirm)}>Reject with this reason</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <fieldset>
          <legend className="text-[13px] font-semibold text-slate-700">Reason</legend>

          <div className="mt-2 space-y-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setValue('reason', preset, { shouldValidate: true })}
                className={cn(
                  'flex w-full cursor-pointer items-center rounded-lg border px-3 py-2 text-left text-[13px] transition-colors',
                  reason === preset
                    ? 'border-rose-300 bg-rose-50 font-semibold text-rose-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50',
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          <input type="hidden" {...register('reason')} />

          {formState.errors.reason && (
            <p className="mt-2 text-xs font-medium text-rose-600">{formState.errors.reason.message}</p>
          )}
        </fieldset>

        <div>
          <label htmlFor="admin-reject-detail" className="text-[13px] font-semibold text-slate-700">
            Note for the user <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <Textarea
            id="admin-reject-detail"
            rows={3}
            placeholder="Tell them exactly what to fix so the next attempt can pass."
            className="mt-2"
            {...register('detail')}
          />
          {formState.errors.detail && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{formState.errors.detail.message}</p>
          )}
        </div>

        <p className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Recorded against your admin account with a timestamp. Rejections cannot be deleted, only superseded.
        </p>
      </div>
    </Modal>
  );
}
