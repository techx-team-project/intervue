'use client';

import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type {
  RecruiterVerificationProfileResource,
  VerificationStepId,
  VerificationStepStatus,
} from '@/types/recruiter-company';
import { AlertCircle, ArrowRight, Check, Clock } from 'lucide-react';
import Link from 'next/link';

interface CartVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationProfile: RecruiterVerificationProfileResource | null;
}

const VERIFICATION_ITEMS: { id: VerificationStepId; label: string; route: string }[] = [
  {
    id: 'PHONE',
    label: 'Verify phone number',
    route: ROUTES.RECRUITER_COMPANY_PHONE_VERIFY,
  },
  {
    id: 'COMPANY',
    label: 'Update company information',
    route: ROUTES.RECRUITER_COMPANY,
  },
  {
    id: 'LICENSE',
    label: 'Verify business registration certificate',
    route: ROUTES.RECRUITER_COMPANY_LICENSE,
  },
  {
    id: 'CANDIDATE_AGREEMENT',
    label: 'Candidate data processing agreement',
    route: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
  },
  {
    id: 'PLATFORM_AGREEMENT',
    label: 'InterVue platform terms of use',
    route: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
  },
];

function StepStatusIcon({ status }: { status: VerificationStepStatus }) {
  if (status === 'APPROVED') {
    return (
      <span className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
        <Check className="h-3.5 w-3.5 stroke-[2.75]" />
      </span>
    );
  }
  if (status === 'IN_REVIEW') {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <Clock className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === 'REJECTED' || status === 'ACTION_REQUIRED') {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertCircle className="h-3.5 w-3.5" />
      </span>
    );
  }
  return <span className="border-outline h-5 w-5 shrink-0 rounded-full border-2 bg-white" />;
}

export default function CartVerificationModal({ isOpen, onClose, verificationProfile }: CartVerificationModalProps) {
  const completionPercent = verificationProfile?.completionPercent ?? 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      radius="xl"
      title="Notice"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="border-outline-variant bg-surface-container-high text-on-surface hover:bg-surface-container cursor-pointer rounded-lg border px-5 py-2 text-sm font-semibold transition"
        >
          Close
        </button>
      }
    >
      <div className="space-y-4">
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Please complete the verification steps below to finish your business profile and get full access to all
          product features.{' '}
          <Link
            href={ROUTES.RECRUITER_COMPANY_VERIFICATION}
            onClick={onClose}
            className="text-primary font-semibold hover:underline"
          >
            Learn more
          </Link>
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface font-bold">Verify information</span>
            <span className="text-primary font-bold">{completionPercent}% complete</span>
          </div>
          <div className="bg-surface-container-high h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, completionPercent))}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="divide-outline-variant/60 divide-y rounded-xl border border-slate-100 bg-white">
          {VERIFICATION_ITEMS.map((item) => {
            const matched = verificationProfile?.steps.find((step) => step.stepId === item.id);
            const status: VerificationStepStatus = matched?.status ?? 'NOT_STARTED';
            const isApproved = status === 'APPROVED';

            return (
              <Link
                key={item.id}
                href={item.route}
                onClick={onClose}
                className="group flex items-center justify-between gap-3 px-3.5 py-3 transition hover:bg-emerald-50/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <StepStatusIcon status={status} />
                  <div className="min-w-0">
                    <span
                      className={cn(
                        'block text-sm',
                        isApproved ? 'text-on-surface font-medium' : 'text-on-surface font-semibold',
                      )}
                    >
                      {item.label}
                    </span>
                    {status === 'IN_REVIEW' && (
                      <span className="text-[11px] font-medium text-amber-700">Pending admin review</span>
                    )}
                    {(status === 'REJECTED' || status === 'ACTION_REQUIRED') && (
                      <span className="text-[11px] font-medium text-rose-600">
                        Needs update / additional information
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="text-primary h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
