'use client';

import ContentViolationWarningModal from '@/components/connect/ContentViolationWarningModal';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import UserAvatar from '@/components/ui/UserAvatar';
import { useConnectMuteStatus, useSendInvitation } from '@/hooks/useRecruiterConnect';
import { isApiError } from '@/lib/api-error';
import { sendInvitationSchema, type SendInvitationFormValues } from '@/schemas/connect.schema';
import type { EligibleCandidate } from '@/types/connect';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const FORM_ID = 'invite-candidate-form';

type InviteCandidateModalProps = {
  prefilledCandidate: EligibleCandidate;
  onClose: (createdPublicId?: string) => void;
};

export default function InviteCandidateModal({ prefilledCandidate, onClose }: InviteCandidateModalProps) {
  const { data: muteStatus } = useConnectMuteStatus();
  const sendInvitation = useSendInvitation();
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [muteTriggered, setMuteTriggered] = useState(false);

  const isMuted = muteStatus ? muteStatus.muted : muteTriggered;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendInvitationFormValues>({
    resolver: zodResolver(sendInvitationSchema),
    defaultValues: { candidateId: prefilledCandidate.candidateId, message: '' },
  });

  const onSubmit = (values: SendInvitationFormValues) => {
    if (isMuted) return;
    sendInvitation.mutate(
      { candidateId: values.candidateId, message: values.message },
      {
        onSuccess: (created) => {
          toast.success('Invitation sent successfully.');
          onClose(created?.publicId);
        },
        onError: (error) => {
          if (isApiError(error)) {
            if (error.code === 'MESSAGE_BLOCKED_BY_FILTER') {
              setShowViolationModal(true);
              return;
            }
            if (error.code === 'CONNECT_MUTED') {
              setMuteTriggered(true);
            }
          }
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <>
      <Modal
        isOpen
        onClose={() => onClose()}
        radius="md"
        title="Invite to Connect"
        footer={
          <>
            <Button type="button" variant="ghost" radius="md" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit" radius="md" form={FORM_ID} disabled={isMuted} isLoading={sendInvitation.isPending}>
              Send invitation
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {isMuted && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div>
                <p className="font-bold">Messaging temporarily restricted</p>
                <p className="mt-0.5 leading-relaxed">
                  {muteStatus?.expiresAt
                    ? `You cannot send invitations until ${formatDateTime(muteStatus.expiresAt)} due to community guideline violations.`
                    : 'Your account has been temporarily restricted due to community guideline violations.'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-surface-container-low flex items-center gap-3 rounded-xl px-3.5 py-2.5">
            <UserAvatar fullName={prefilledCandidate.fullName} size="sm" />
            <div className="min-w-0">
              <p className="text-body-sm text-on-surface truncate font-semibold">{prefilledCandidate.fullName}</p>
              <p className="text-label-sm text-on-surface-variant truncate">
                {prefilledCandidate.jobTitle
                  ? `${prefilledCandidate.jobTitle} • ${prefilledCandidate.email}`
                  : prefilledCandidate.email}
              </p>
            </div>
          </div>

          <Textarea
            label="Opening message"
            placeholder="Hello, our company has an exciting position matching your profile..."
            rows={4}
            disabled={isMuted}
            error={errors.message?.message}
            {...register('message')}
          />
        </form>
      </Modal>

      <ContentViolationWarningModal isOpen={showViolationModal} onClose={() => setShowViolationModal(false)} />
    </>
  );
}
