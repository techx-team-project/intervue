import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import type { IdentityVerificationResource } from '@/types/identity-verification';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function messageFor(identity: IdentityVerificationResource) {
  if (identity.status === 'PENDING') {
    return 'Your verification is pending review (expected within 24 business hours). You can apply as soon as it is approved.';
  }
  if (identity.status === 'REJECTED') {
    return identity.canSubmit
      ? `Your verification was not approved: ${identity.rejectReason}. Please resubmit to apply.`
      : 'Your verification was not approved and you have no resubmissions left. You can ask an admin for a manual review.';
  }
  return 'You need to verify your identity with your national ID before applying. It only takes a few minutes.';
}

export default function ApplyIdentityGate({ identity }: { identity: IdentityVerificationResource }) {
  const actionLabel = identity.status === 'PENDING' ? 'View status' : 'Verify identity';

  return (
    <div className="space-y-4 py-6 text-center">
      <ShieldCheck className="text-primary mx-auto h-10 w-10" aria-hidden />
      <p className="text-on-surface-variant mx-auto max-w-sm text-sm">{messageFor(identity)}</p>
      <Link href={ROUTES.CANDIDATE_IDENTITY_VERIFICATION}>
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  );
}
