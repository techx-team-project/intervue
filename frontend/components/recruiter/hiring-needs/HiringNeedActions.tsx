import type { HiringNeed } from '@/types/recruiter-hiring-need';
import { Pencil, Trash2 } from 'lucide-react';

const ACTION_BUTTON_CLASS =
  'inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface';

type HiringNeedActionsProps = {
  need: HiringNeed;
  label: string;
  onEdit: (need: HiringNeed) => void;
  onDelete: (need: HiringNeed) => void;
};

export default function HiringNeedActions({ need, label, onEdit, onDelete }: HiringNeedActionsProps) {
  return (
    <div className="flex shrink-0 justify-end gap-1">
      <button type="button" aria-label={`Edit ${label}`} onClick={() => onEdit(need)} className={ACTION_BUTTON_CLASS}>
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Delete ${label}`}
        onClick={() => onDelete(need)}
        className={ACTION_BUTTON_CLASS}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
