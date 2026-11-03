'use client';

import PageHeader from '@/components/recruiter/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { RecruiterNeedsFormData } from '@/schemas/recruiter.schema';
import type { HiringNeed } from '@/types/recruiter-hiring-need';
import { describeHiringNeed } from '@/utils/hiring-need';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import HiringNeedFormModal from './HiringNeedFormModal';
import HiringNeedsList from './HiringNeedsList';

type HiringNeedsViewProps = {
  initialNeeds: HiringNeed[];
};

type FormTarget = { need: HiringNeed | null };

const toHiringNeed = (id: string, values: RecruiterNeedsFormData): HiringNeed => ({
  id,
  position: values.position,
  level: values.level,
  hireBy: values.continuous ? '' : values.hireBy,
  continuous: values.continuous,
  headcount: values.headcount,
  budgetFrom: values.budgetFrom,
  budgetTo: values.budgetTo,
  budgetSource: values.budgetSource,
});

export default function HiringNeedsView({ initialNeeds }: HiringNeedsViewProps) {
  const [needs, setNeeds] = useState(initialNeeds);
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HiringNeed | null>(null);

  const openAddForm = () => setFormTarget({ need: null });

  const handleSave = (values: RecruiterNeedsFormData) => {
    const editing = formTarget?.need;
    if (editing) {
      setNeeds((current) => current.map((need) => (need.id === editing.id ? toHiringNeed(editing.id, values) : need)));
      toast.success('Hiring need updated.');
    } else {
      setNeeds((current) => [toHiringNeed(crypto.randomUUID(), values), ...current]);
      toast.success('Hiring need added.');
    }
    setFormTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setNeeds((current) => current.filter((need) => need.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('Hiring need deleted.');
  };

  return (
    <>
      <PageHeader
        title="Hiring needs"
        description="Plan the IT roles your company needs to fill and the budget for each one."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAddForm}>
            Add hiring need
          </Button>
        }
      />

      <HiringNeedsList
        needs={needs}
        onAdd={openAddForm}
        onEdit={(need) => setFormTarget({ need })}
        onDelete={setDeleteTarget}
      />

      {formTarget && (
        <HiringNeedFormModal
          key={formTarget.need?.id ?? 'new'}
          initialValues={formTarget.need ? { ...formTarget.need, consultation: '' } : undefined}
          onClose={() => setFormTarget(null)}
          onSave={handleSave}
        />
      )}

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete hiring need?"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <p className="text-sm leading-relaxed text-slate-600">
            <strong className="text-slate-900">{describeHiringNeed(deleteTarget).role}</strong> (
            {describeHiringNeed(deleteTarget).level}) will be removed from your hiring needs. You can add it again
            later.
          </p>
        )}
      </Modal>
    </>
  );
}
