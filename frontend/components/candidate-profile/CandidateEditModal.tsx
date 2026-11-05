'use client';

import Modal from '@/components/ui/Modal';
import { useUpdateCandidateProfile } from '@/hooks/useCandidateProfile';
import type { CandidateProfileResponse } from '@/types/candidate-profile';
import { User } from 'lucide-react';
import CandidateEditForm from './CandidateEditForm';

type CandidateEditModalProps = {
  profile: CandidateProfileResponse;
  isOpen: boolean;
  onClose: () => void;
};

export default function CandidateEditModal({ profile, isOpen, onClose }: CandidateEditModalProps) {
  const update = useUpdateCandidateProfile();
  const handleClose = () => {
    if (!update.isPending) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Edit profile</h2>
            <p className="text-xs text-slate-500">Update your details and job preferences</p>
          </div>
        </div>
      }
    >
      <CandidateEditForm profile={profile} update={update} onClose={onClose} />
    </Modal>
  );
}
