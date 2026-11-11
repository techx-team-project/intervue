'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { AdminServicePackage } from '@/types/admin-service-package';
import { EyeOff } from 'lucide-react';

interface DeactivatePackageDialogProps {
  pkg: AdminServicePackage | null;
  isUpdating: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeactivatePackageDialog({ pkg, isUpdating, onClose, onConfirm }: DeactivatePackageDialogProps) {
  const hasAdBenefit = pkg?.benefits.some((benefit) => benefit.entitlementType === 'AD_SLOT_WEEK') ?? false;

  return (
    <Modal
      isOpen={pkg !== null}
      onClose={onClose}
      maxWidth="sm"
      radius="2xl"
      title="Deactivate this service package?"
      description={pkg ? `"${pkg.name}" (${pkg.code}) will be hidden from the recruiter catalog.` : undefined}
      className="dark:border-forest-800 dark:bg-forest-900 dark:text-forest-50"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isUpdating}>
            Deactivate package
          </Button>
        </>
      }
    >
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-3.5 py-3 text-xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Recruiters will no longer see this package or add it to carts and new checkouts. Existing paid orders remain
            unaffected.
          </span>
        </div>
        {hasAdBenefit && (
          <p className="dark:text-forest-300 text-on-surface-variant text-xs leading-relaxed">
            Note: this package grants weekly ad banner slots. Deactivating it also stops new purchases from any linked
            advertising slot.
          </p>
        )}
      </div>
    </Modal>
  );
}
