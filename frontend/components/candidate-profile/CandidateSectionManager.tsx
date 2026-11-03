'use client';

import { useDeleteCandidateItem, useSaveCandidateItem, type SaveItemMutation } from '@/hooks/useCandidateSection';
import type { CandidateSection } from '@/types/candidate-profile';
import type { LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import CandidateDeleteModal from './CandidateDeleteModal';
import CandidateItemActions from './CandidateItemActions';
import CandidateItemModal from './CandidateItemModal';
import CandidateSectionCard from './CandidateSectionCard';

export type CandidateItemFormProps<S extends CandidateSection, T> = {
  item: T | null;
  save: SaveItemMutation<S>;
  onClose: () => void;
};

type CandidateSectionManagerProps<S extends CandidateSection, T extends { id: number }> = {
  section: S;
  title: string;
  icon: LucideIcon;
  addLabel: string;
  emptyText: string;
  itemNoun: string;
  items: T[];
  getName: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  renderForm: (props: CandidateItemFormProps<S, T>) => ReactNode;
};

export default function CandidateSectionManager<S extends CandidateSection, T extends { id: number }>({
  section,
  title,
  icon,
  addLabel,
  emptyText,
  itemNoun,
  items,
  getName,
  renderItem,
  renderForm,
}: CandidateSectionManagerProps<S, T>) {
  const save = useSaveCandidateItem(section);
  const remove = useDeleteCandidateItem(section);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  const openForm = (item: T | null) => {
    setEditing(item);
    setIsFormOpen(true);
  };
  const closeForm = () => setIsFormOpen(false);
  const confirmDelete = () => {
    if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  };

  return (
    <>
      <CandidateSectionCard
        title={title}
        icon={icon}
        addLabel={addLabel}
        emptyText={emptyText}
        isEmpty={items.length === 0}
        onAdd={() => openForm(null)}
      >
        {items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">{renderItem(item)}</div>
            <CandidateItemActions
              name={getName(item)}
              onEdit={() => openForm(item)}
              onDelete={() => setDeleting(item)}
            />
          </li>
        ))}
      </CandidateSectionCard>

      <CandidateItemModal
        title={`${editing ? 'Edit' : 'Add'} ${itemNoun}`}
        isOpen={isFormOpen}
        isPending={save.isPending}
        onClose={closeForm}
      >
        {renderForm({ item: editing, save, onClose: closeForm })}
      </CandidateItemModal>

      <CandidateDeleteModal
        isOpen={deleting !== null}
        name={deleting ? getName(deleting) : ''}
        isPending={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
