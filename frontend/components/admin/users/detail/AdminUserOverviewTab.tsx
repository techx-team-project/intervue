import { LINKED_RECORD_ICON, RESTRICTION_META } from '@/constants/admin-user';
import { cn } from '@/lib/utils';
import type { AdminUserDetail, AdminUserListItem } from '@/types/admin-user';
import { formatDate, formatDateTime, formatRelativeDay } from '@/utils/datetime';
import { AlertCircle, BadgeCheck, Building2, FileText, MailCheck, MailWarning, Target } from 'lucide-react';
import AdminUserFactList, { type AdminUserFact } from './AdminUserFactList';
import AdminUserPanel from './AdminUserPanel';

interface AdminUserOverviewTabProps {
  detail: AdminUserDetail;
  user: AdminUserListItem;
}

const IDENTITY_LABEL = {
  approved: 'Approved',
  pending: 'Pending review',
  rejected: 'Rejected',
  not_submitted: 'Not submitted',
};

const IDENTITY_TONE = {
  approved: 'text-emerald-600',
  pending: 'text-amber-600',
  rejected: 'text-rose-600',
  not_submitted: 'text-slate-400',
};

export default function AdminUserOverviewTab({ detail, user }: AdminUserOverviewTabProps) {
  const isVerified = user.emailVerifiedAt !== null;
  const { profile } = detail;

  const identityFacts: AdminUserFact[] = [
    { label: 'Account id', value: `#${user.id}` },
    {
      label: 'Email',
      value: (
        <span className="inline-flex items-center gap-1.5">
          {user.email}
          {isVerified ? (
            <MailCheck className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <MailWarning className="h-3.5 w-3.5 text-amber-600" />
          )}
        </span>
      ),
      hint: isVerified ? `Verified ${formatDate(user.emailVerifiedAt as string)}` : 'Not verified',
    },
    { label: 'Phone', value: user.phone ?? 'Not provided' },
    { label: 'Address', value: detail.address ?? 'Not provided' },
    { label: 'Registered', value: formatDateTime(user.createdAt) },
    {
      label: 'Last sign-in',
      value: user.lastSignInAt ? formatRelativeDay(user.lastSignInAt) : 'Never signed in',
      hint: user.lastSignInAt ? formatDateTime(user.lastSignInAt) : undefined,
    },
    { label: 'Terms accepted', value: detail.termsAcceptedAt ? formatDateTime(detail.termsAcceptedAt) : 'Never' },
    { label: 'Last updated', value: formatDateTime(detail.updatedAt) },
  ];

  return (
    <div className="space-y-4">
      {user.restriction && (
        <div
          className={cn(
            'flex items-start gap-3 rounded-2xl border p-4',
            user.restriction.kind === 'ban' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50',
          )}
        >
          <AlertCircle
            className={cn(
              'mt-0.5 h-5 w-5 shrink-0',
              user.restriction.kind === 'ban' ? 'text-rose-600' : 'text-amber-600',
            )}
          />
          <div className="min-w-0">
            <p
              className={cn(
                'text-[13.5px] font-bold',
                user.restriction.kind === 'ban' ? 'text-rose-900' : 'text-amber-900',
              )}
            >
              {user.restriction.kind === 'ban' ? 'Banned' : 'Locked'} — {user.restriction.reason}
            </p>
            {user.restriction.detail && (
              <p
                className={cn(
                  'mt-1 text-[12.5px]',
                  user.restriction.kind === 'ban' ? 'text-rose-700' : 'text-amber-800',
                )}
              >
                {user.restriction.detail}
              </p>
            )}
            <p
              className={cn(
                'mt-1.5 text-[11.5px]',
                user.restriction.kind === 'ban' ? 'text-rose-600' : 'text-amber-700',
              )}
            >
              {user.restriction.byName} · {formatDateTime(user.restriction.at)}
              {user.restriction.expiresAt ? ` · lifts automatically ${formatDate(user.restriction.expiresAt)}` : ''}
            </p>
            <p className="mt-1.5 text-[11.5px] text-slate-500">{RESTRICTION_META[user.restriction.kind].blurb}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AdminUserPanel title="Identity" description="Stored on the account record itself.">
          <AdminUserFactList facts={identityFacts} />
        </AdminUserPanel>

        <div className="space-y-4">
          <AdminUserPanel title="Profile" description="What the account looks like to the other side of the platform.">
            {profile.headline === null && profile.companyName === null ? (
              <p className="dark:text-forest-300 py-2 text-[12.5px] text-[#64748b]">
                This account has no candidate or recruiter profile yet.
              </p>
            ) : (
              <div className="space-y-3">
                {profile.headline && (
                  <div className="flex items-start gap-2.5">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8]" />
                    <div className="min-w-0">
                      <p className="text-navy dark:text-forest-50 text-[13px] font-bold">{profile.headline}</p>
                      <p className="dark:text-forest-300 text-[11.5px] text-[#64748b]">{profile.jobSearchStatus}</p>
                    </div>
                  </div>
                )}

                {profile.companyName && (
                  <div className="flex items-start gap-2.5">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8]" />
                    <div className="min-w-0">
                      <p className="text-navy dark:text-forest-50 text-[13px] font-bold">{profile.companyName}</p>
                      <p className="dark:text-forest-300 text-[11.5px] text-[#64748b]">
                        Company verification level {profile.companyVerificationLevel} of 3
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8]" />
                  <div className="min-w-0">
                    <p className={cn('text-[13px] font-bold', IDENTITY_TONE[profile.identityVerification])}>
                      {IDENTITY_LABEL[profile.identityVerification]}
                    </p>
                    <p className="dark:text-forest-300 text-[11.5px] text-[#64748b]">Identity verification (eKYC)</p>
                  </div>
                </div>

                {profile.cvCount > 0 && (
                  <div className="flex items-start gap-2.5">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8]" />
                    <div className="min-w-0">
                      <p className="text-navy dark:text-forest-50 text-[13px] font-bold">
                        {profile.cvCount} CV{profile.cvCount === 1 ? '' : 's'} uploaded
                      </p>
                      <p className="dark:text-forest-300 text-[11.5px] text-[#64748b]">
                        Profile {profile.completeness}% complete
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="dark:bg-forest-850 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="bg-primary h-full rounded-full transition-[width]"
                      style={{ width: `${Math.min(100, profile.completeness)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#94a3b8]">Profile completeness {profile.completeness}%</p>
                </div>
              </div>
            )}
          </AdminUserPanel>

          <AdminUserPanel
            title="Related records"
            description="Handled on their own queue pages — this is a read-only summary."
          >
            {detail.linkedRecords.length === 0 ? (
              <p className="dark:text-forest-300 py-2 text-[12.5px] text-[#64748b]">
                This account holds no candidate or recruiter records yet.
              </p>
            ) : (
              <ul className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
                {detail.linkedRecords.map((record) => {
                  const Icon = LINKED_RECORD_ICON[record.key];

                  return (
                    <li key={record.key} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                        <span className="dark:text-forest-100 truncate text-[12.5px] font-semibold text-[#334155]">
                          {record.label}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-2">
                        <span className="dark:text-forest-300 text-[12px] text-[#64748b]">{record.value}</span>
                        <span className="dark:bg-forest-850 dark:text-forest-400 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          Queue page coming soon
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminUserPanel>
        </div>
      </div>
    </div>
  );
}
