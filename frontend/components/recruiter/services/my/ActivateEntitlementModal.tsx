'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { useRecruiterJobList } from '@/hooks/useRecruiterJobs';
import type { Entitlement } from '@/types/entitlement';
import type { EntitlementType } from '@/types/service-package';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ActivateEntitlementModalProps {
  entitlement: Entitlement | null;
  onClose: () => void;
  onConfirm: (jobId?: number) => void;
  isBusy: boolean;
  error: string | null;
}

const COMPANY_LEVEL: EntitlementType[] = ['BRAND_PAGE', 'FEATURED_COMPANY'];

export default function ActivateEntitlementModal({
  entitlement,
  onClose,
  onConfirm,
  isBusy,
  error,
}: ActivateEntitlementModalProps) {
  const onCompany = entitlement !== null && COMPANY_LEVEL.includes(entitlement.entitlementType);
  const isRetop = entitlement?.entitlementType === 'JOB_RETOP';
  const { data } = useRecruiterJobList({ status: 'PUBLISHED', page: 0, size: 100 });
  const [jobId, setJobId] = useState('');

  const options = [
    { value: '', label: '— Select a job —' },
    ...(data?.items ?? []).map((job) => ({ value: String(job.id), label: job.title })),
  ];

  const modalTitle = onCompany
    ? 'Activate service for the company'
    : isRetop
      ? 'Boost job to top'
      : 'Apply service to a job';

  return (
    <Modal isOpen={entitlement !== null} onClose={onClose} title={modalTitle} maxWidth="lg">
      {entitlement && (
        <>
          <p className="text-on-surface-variant text-sm">
            Service: <strong className="text-on-surface">{entitlement.label}</strong> · {entitlement.remainingQuantity}{' '}
            left
            {entitlement.durationDays ? ` · valid for ${entitlement.durationDays} days` : ''}
          </p>

          {onCompany ? (
            <p className="text-on-surface-variant mt-4 text-sm">
              This service applies to the whole company and is not tied to a specific job.
            </p>
          ) : (
            <div className="mt-4">
              <Select
                label="Active jobs"
                value={jobId}
                onChange={(event) => setJobId(event.target.value)}
                options={options}
              />
              {(data?.items ?? []).length === 0 && (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                  You have no jobs currently live. Post a job before applying this service.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-amber-900">
              {isRetop ? (
                <>
                  The selected job moves to the top of the list immediately and <strong>uses 1 boost</strong>.
                </>
              ) : (
                <>
                  Once applied it <strong>cannot be removed</strong>. The validity period starts now.
                </>
              )}
            </p>
          </div>

          {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(onCompany ? undefined : Number(jobId))}
              disabled={!onCompany && !jobId}
              isLoading={isBusy}
            >
              {isRetop ? 'Boost now' : 'Confirm'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
