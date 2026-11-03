'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useBecomeRecruiter } from '@/hooks/useBecomeRecruiter';
import { useResendVerification } from '@/hooks/useResendVerification';

type BecomeRecruiterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BecomeRecruiterDialog({ isOpen, onClose }: BecomeRecruiterDialogProps) {
  const { user } = useAuth();
  const becomeRecruiter = useBecomeRecruiter();
  const resend = useResendVerification();
  const emailVerified = user?.emailVerified ?? false;

  const footer = emailVerified ? (
    <>
      <Button variant="ghost" onClick={onClose} disabled={becomeRecruiter.isPending}>
        Maybe Later
      </Button>
      <Button
        isLoading={becomeRecruiter.isPending}
        onClick={() => becomeRecruiter.mutate(undefined, { onSuccess: onClose })}
      >
        Activate Recruiter Role
      </Button>
    </>
  ) : (
    <>
      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
      <Button isLoading={resend.isPending} onClick={() => resend.mutate()}>
        Resend Verification Email
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activate Recruiter Privileges" footer={footer}>
      {emailVerified ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Your account will be granted Recruiter privileges to publish job posts and manage candidate applications. Your
          existing candidate roles will remain intact and you can switch between roles at any time.
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-slate-600">
          You need to verify your email address <strong>{user?.email}</strong> before activating the Recruiter role.
          Please check your inbox or click below to resend the verification email.
        </p>
      )}
    </Modal>
  );
}
