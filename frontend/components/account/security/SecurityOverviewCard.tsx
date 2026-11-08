import Badge from '@/components/ui/Badge';
import { ArrowRight, Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type SecurityOverviewCardProps = {
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  passwordHref: string;
};

function DoneIcon() {
  return (
    <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white">
      <Check className="h-3.5 w-3.5 stroke-3" />
    </div>
  );
}

function PendingIcon() {
  return <div className="border-outline h-5 w-5 shrink-0 rounded-md border-2 bg-white" />;
}

function StatusLabel({ done }: { done: boolean }) {
  return (
    <span className={`shrink-0 text-xs font-semibold ${done ? 'text-primary' : 'text-amber-700'}`}>
      {done ? 'Completed' : 'Pending'}
    </span>
  );
}

export default function SecurityOverviewCard({
  email,
  emailVerified,
  phone,
  phoneVerified,
  passwordHref,
}: SecurityOverviewCardProps) {
  const completed = [emailVerified, phoneVerified, true, false].filter(Boolean).length;

  return (
    <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            <h1 className="text-on-surface text-xl font-bold sm:text-2xl">Account security</h1>
          </div>
          <p className="text-on-surface-variant mt-1 text-sm">
            Manage your protections, sign-in details and active sessions.
          </p>
        </div>

        <Badge variant="success" size="md">
          <CheckCircle2 className="text-primary h-3.5 w-3.5" />
          <span>{completed} of 4 security tasks completed</span>
        </Badge>
      </div>

      <div className="border-outline-variant mt-5 grid grid-cols-1 gap-x-8 gap-y-3.5 border-t pt-5 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            {emailVerified ? <DoneIcon /> : <PendingIcon />}
            <div className="min-w-0">
              <div className="text-on-surface truncate text-sm font-semibold">Primary email verified</div>
              <div className="text-on-surface-variant truncate text-xs">{email}</div>
            </div>
          </div>
          <StatusLabel done={emailVerified} />
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            {phoneVerified ? <DoneIcon /> : <PendingIcon />}
            <div className="min-w-0">
              <div className="text-on-surface truncate text-sm font-semibold">Recovery phone number</div>
              <div className="text-on-surface-variant truncate text-xs">{phone || 'No phone number added'}</div>
            </div>
          </div>
          <StatusLabel done={phoneVerified} />
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <DoneIcon />
            <div className="min-w-0">
              <div className="text-on-surface truncate text-sm font-semibold">Strong password</div>
              <div className="text-on-surface-variant truncate text-xs">A high-strength password is set</div>
            </div>
          </div>
          <Link
            href={passwordHref}
            className="hover:text-primary text-on-surface-variant shrink-0 text-xs font-semibold hover:underline"
          >
            Change password
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <PendingIcon />
            <div className="min-w-0">
              <div className="text-on-surface truncate text-sm font-bold">Two-factor authentication</div>
              <div className="text-on-surface-variant truncate text-xs">Via authenticator app</div>
            </div>
          </div>
          <Link
            href="/account/two-factor"
            className="bg-primary hover:bg-primary-hover inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition"
          >
            <span>Enable</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
