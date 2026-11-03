'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { HIRING_NEED_DEFAULT_VALUES } from '@/constants/recruiter-onboarding';
import { recruiterNeedsSchema, type RecruiterNeedsFormData } from '@/schemas/recruiter.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import HiringNeedFields from './HiringNeedFields';

const FORM_ID = 'hiring-need-form';

type HiringNeedFormModalProps = {
  initialValues?: RecruiterNeedsFormData;
  onClose: () => void;
  onSave: (values: RecruiterNeedsFormData) => void;
};

export default function HiringNeedFormModal({ initialValues, onClose, onSave }: HiringNeedFormModalProps) {
  const form = useForm<RecruiterNeedsFormData>({
    resolver: zodResolver(recruiterNeedsSchema),
    mode: 'onTouched',
    defaultValues: initialValues ?? HIRING_NEED_DEFAULT_VALUES,
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={initialValues ? 'Edit hiring need' : 'Add hiring need'}
      description="InterVue uses your hiring needs to suggest candidates and services that fit each role."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            Save
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={form.handleSubmit(onSave)} noValidate className="space-y-5">
        <HiringNeedFields form={form} />
      </form>
    </Modal>
  );
}
