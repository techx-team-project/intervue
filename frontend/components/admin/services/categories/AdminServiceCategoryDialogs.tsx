'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { AdminServiceCategory } from '@/types/admin-service-package';
import { AlertTriangle, EyeOff } from 'lucide-react';

interface DeleteCategoryDialogProps {
  category: AdminServiceCategory | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCategoryDialog({ category, isDeleting, onClose, onConfirm }: DeleteCategoryDialogProps) {
  return (
    <Modal
      isOpen={category !== null}
      onClose={onClose}
      maxWidth="sm"
      radius="2xl"
      title="Delete service category?"
      description={
        category ? `Category "${category.name}" (${category.code}) currently has no linked packages.` : undefined
      }
      className="dark:border-forest-800 dark:bg-forest-900 dark:text-forest-50"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
            Delete category
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-3.5 py-3 text-xs text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
        <span>This permanently removes the category and cannot be undone.</span>
      </div>
    </Modal>
  );
}

interface HideCategoryDialogProps {
  category: AdminServiceCategory | null;
  isUpdating: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function HideCategoryDialog({ category, isUpdating, onClose, onConfirm }: HideCategoryDialogProps) {
  return (
    <Modal
      isOpen={category !== null}
      onClose={onClose}
      maxWidth="sm"
      radius="2xl"
      title="Hide this category from recruiters?"
      description={
        category
          ? `"${category.name}" currently holds ${category.packageCount} ${category.packageCount === 1 ? 'package' : 'packages'}.`
          : undefined
      }
      className="dark:border-forest-800 dark:bg-forest-900 dark:text-forest-50"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={onConfirm} isLoading={isUpdating}>
            Hide category
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-3.5 py-3 text-xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
        <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          Hiding this category removes the entire section from the recruiter buy-services catalog until you re-enable
          it.
        </span>
      </div>
    </Modal>
  );
}
