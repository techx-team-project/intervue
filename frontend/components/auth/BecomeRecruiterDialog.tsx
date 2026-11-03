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
        Later
      </Button>
      <Button
        isLoading={becomeRecruiter.isPending}
        onClick={() => becomeRecruiter.mutate(undefined, { onSuccess: onClose })}
      >
        Become a recruiter
      </Button>
    </>
  ) : (
    <>
      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
      <Button isLoading={resend.isPending} onClick={() => resend.mutate()}>
        Resend verification email
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Become a recruiter" footer={footer}>
      {emailVerified ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Your account will also get the recruiter role so you can post jobs and manage applications. Your current roles
          stay the same and you can switch between them anytime.
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-slate-600">
          Verify <strong>{user?.email}</strong> before enabling the recruiter role. Check your inbox or resend the
          verification email.
        </p>
      )}
    </Modal>
  );
}
