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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                {config.badgeText}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                Phiên bản v{config.version}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">{config.title}</h2>
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
            className="w-full text-xs font-semibold text-slate-600 hover:bg-slate-100 sm:w-auto"
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
      <div className="space-y-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
        <p className="rounded-xl bg-slate-50 p-3.5 text-slate-700 ring-1 ring-slate-200/60">{config.summary}</p>

        <div className="max-h-72 scrollbar-thin space-y-3.5 overflow-y-auto pr-1.5">
          {config.sections.map((section, index) => (
            <div key={index} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <h3 className="font-semibold text-slate-900">{section.heading}</h3>
              <p className="mt-1 text-slate-600">{section.details}</p>
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
