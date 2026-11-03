import { Edit2, Trash2 } from 'lucide-react';

type CandidateItemActionsProps = {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
};

const BUTTON_CLASS =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#6f7882] transition-colors hover:bg-[#f4f5f5]';

export default function CandidateItemActions({ name, onEdit, onDelete }: CandidateItemActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        className={`${BUTTON_CLASS} hover:text-primary`}
        title={`Edit ${name}`}
        aria-label={`Edit ${name}`}
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`${BUTTON_CLASS} hover:text-rose-600`}
        title={`Delete ${name}`}
        aria-label={`Delete ${name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
