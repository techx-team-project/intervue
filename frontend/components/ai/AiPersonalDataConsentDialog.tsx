'use client';

import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AI_PERSONAL_DATA_CONSENT_CONFIG } from '@/constants/ai-consent';
import { CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react';

export interface AiPersonalDataConsentDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AiPersonalDataConsentDialog({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: AiPersonalDataConsentDialogProps) {
  const config = AI_PERSONAL_DATA_CONSENT_CONFIG;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      maxWidth="lg"
      className="p-0 sm:max-w-xl"
      title={
        <div className="flex items-start gap-3 text-left">
          <div className="bg-primary-light text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-emerald-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-label-sm text-on-primary-container inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-0.5 font-semibold">
                <Sparkles className="text-primary h-3 w-3" />
                {config.badgeText}
              </span>
              <span className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-full px-2 py-0.5 font-medium">
                Phiên bản v{config.version}
              </span>
            </div>
            <h2 className="text-on-surface text-base font-bold sm:text-lg">{config.title}</h2>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="text-on-surface-variant hover:bg-surface-container-high w-full text-xs font-semibold sm:w-auto"
          >
            {config.cancelButtonText}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full gap-1.5 text-xs font-semibold shadow-xs sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{config.confirmButtonText}</span>
          </Button>
        </div>
      }
    >
      <div className="text-on-surface-variant space-y-4 text-xs leading-relaxed sm:text-sm">
        <p className="bg-surface-container-low text-on-surface rounded-xl p-3.5 ring-1 ring-slate-200/60">
          {config.summary}
        </p>

        <div className="max-h-72 scrollbar-thin space-y-3.5 overflow-y-auto pr-1.5">
          {config.sections.map((section, index) => (
            <div key={index} className="border-outline-variant/80 rounded-xl border bg-white p-3.5 shadow-2xs">
              <h3 className="text-on-surface font-semibold">{section.heading}</h3>
              <p className="text-on-surface-variant mt-1">{section.details}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 p-3 text-xs text-amber-900 ring-1 ring-amber-200/60">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>{config.notice}</p>
        </div>
      </div>
    </Modal>
  );
}
