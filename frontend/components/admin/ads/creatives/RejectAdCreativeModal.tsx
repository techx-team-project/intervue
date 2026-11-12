'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { AD_CREATIVE_REJECTION_PRESETS, formatIsoWeekRange } from '@/lib/admin-ads';
import { AD_SLOT_FIELD_LIMITS, rejectCreativeSchema, type RejectCreativeFormData } from '@/schemas/ad-slot.schema';
import type { AdminAdCreative } from '@/types/ads';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface RejectAdCreativeModalProps {
  creative: AdminAdCreative | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (creativeId: number, reason: string) => Promise<void>;
}

export default function RejectAdCreativeModal({
  creative,
  isSubmitting,
  onClose,
  onConfirm,
}: RejectAdCreativeModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RejectCreativeFormData>({
    resolver: zodResolver(rejectCreativeSchema),
    defaultValues: { rejectionReason: '' },
  });

  useEffect(() => {
    if (creative) {
      reset({ rejectionReason: '' });
    }
  }, [creative, reset]);

  const submitForm = async (values: RejectCreativeFormData) => {
    if (!creative) return;
    await onConfirm(creative.id, values.rejectionReason.trim());
  };

  return (
    <Modal
      isOpen={creative !== null}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title="Reject banner artwork"
      description={
        creative
          ? `${creative.slotCode} · Company #${creative.companyId} · ${formatIsoWeekRange(creative.weekStart, creative.weekEnd)}`
          : undefined
      }
      maxWidth="lg"
      radius="xl"
    >
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <p className="dark:text-forest-300 text-on-surface-variant text-xs leading-relaxed">
          The advertiser will receive this note and can upload a corrected banner. Until approved artwork replaces it,
          this week shows the slot&apos;s house ad instead.
        </p>

        <div>
          <p className="text-navy dark:text-forest-100 mb-2 text-xs font-semibold">Quick reasons</p>
          <div className="flex flex-wrap gap-1.5">
            {AD_CREATIVE_REJECTION_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setValue('rejectionReason', preset, { shouldValidate: true })}
                className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-200 dark:hover:bg-forest-850 border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-navy cursor-pointer rounded-full border px-2.5 py-1 text-left text-[11px] font-medium transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Rejection reason"
          rows={3}
          maxLength={AD_SLOT_FIELD_LIMITS.rejectionReasonMax}
          placeholder="Explain clearly why the artwork was rejected..."
          className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50"
          error={errors.rejectionReason?.message}
          {...register('rejectionReason')}
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" size="sm" isLoading={isSubmitting}>
            Reject artwork
          </Button>
        </div>
      </form>
    </Modal>
  );
}
