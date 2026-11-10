'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import UserAvatar from '@/components/ui/UserAvatar';
import { useSendInvitation } from '@/hooks/useRecruiterConnect';
import { sendInvitationSchema, type SendInvitationFormValues } from '@/schemas/connect.schema';
import type { EligibleCandidate } from '@/types/connect';
import { getErrorMessage } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const FORM_ID = 'invite-candidate-form';

type InviteCandidateModalProps = {
  prefilledCandidate: EligibleCandidate;
  onClose: () => void;
};

export default function InviteCandidateModal({ prefilledCandidate, onClose }: InviteCandidateModalProps) {
  const sendInvitation = useSendInvitation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendInvitationFormValues>({
    resolver: zodResolver(sendInvitationSchema),
    defaultValues: { candidateId: prefilledCandidate.candidateId, message: '' },
  });

  const onSubmit = (values: SendInvitationFormValues) => {
    sendInvitation.mutate(
      { candidateId: values.candidateId, message: values.message },
      {
        onSuccess: () => {
          toast.success('Invitation sent successfully.');
          onClose();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Invite to Connect"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={sendInvitation.isPending}>
            Send invitation
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="bg-surface-container-low flex items-center gap-3 rounded-xl px-3.5 py-2.5">
          <UserAvatar fullName={prefilledCandidate.fullName} size="sm" />
          <div className="min-w-0">
            <p className="text-body-sm text-on-surface truncate font-semibold">{prefilledCandidate.fullName}</p>
            <p className="text-label-sm text-on-surface-variant truncate">{prefilledCandidate.email}</p>
          </div>
        </div>

        <Textarea
          label="Opening message"
          placeholder="Hello, our company has an exciting position matching your profile..."
          rows={4}
          error={errors.message?.message}
          {...register('message')}
        />
      </form>
    </Modal>
  );
}
