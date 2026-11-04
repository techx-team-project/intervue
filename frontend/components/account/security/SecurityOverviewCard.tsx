import Badge from '@/components/ui/Badge';
import { ArrowRight, Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type SecurityOverviewCardProps = { email: string; passwordHref: string };

function DoneIcon() {
  return (
    <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white">
      <Check className="h-3.5 w-3.5 stroke-3" />
    </div>
  );
}

export default function SecurityOverviewCard({ email, passwordHref }: SecurityOverviewCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            <h1 className="text-xl font-black text-slate-800 sm:text-2xl">Account security</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Manage your protections, sign-in details and active sessions.</p>
        </div>

        <Badge variant="success" size="md">
          <CheckCircle2 className="text-primary h-3.5 w-3.5" />
          <span>3 of 4 security tasks completed</span>
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3.5 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <DoneIcon />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-800">Primary email verified</div>
              <div className="truncate text-xs text-slate-500">{email}</div>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-emerald-700">Completed</span>
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <DoneIcon />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-800">Recovery phone number</div>
              <div className="truncate text-xs text-slate-500">0988 ••• 321</div>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-emerald-700">Completed</span>
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <DoneIcon />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-800">Strong password</div>
              <div className="truncate text-xs text-slate-500">A high-strength password is set</div>
            </div>
          </div>
          <Link
            href={passwordHref}
            className="hover:text-primary shrink-0 text-xs font-semibold text-slate-500 hover:underline"
          >
            Change password
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white" />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-800">Two-factor authentication</div>
              <div className="truncate text-xs text-slate-500">Qua Authenticator App</div>
            </div>
          </div>
          <Link
            href="/account/two-factor"
            className="bg-primary inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700"
          >
            <span>Enable</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
