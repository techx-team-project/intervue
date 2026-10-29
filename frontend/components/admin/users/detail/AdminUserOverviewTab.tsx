import { LINKED_RECORD_ICON } from '@/constants/admin-user';
import type { AdminUserDetail, AdminUserListItem } from '@/types/admin-user';
import { formatDate, formatDateTime } from '@/utils/datetime';
import { AlertCircle, MailCheck, MailWarning } from 'lucide-react';
import AdminUserFactList, { type AdminUserFact } from './AdminUserFactList';
import AdminUserPanel from './AdminUserPanel';

interface AdminUserOverviewTabProps {
  detail: AdminUserDetail;
  user: AdminUserListItem;
}

export default function AdminUserOverviewTab({ detail, user }: AdminUserOverviewTabProps) {
  const isVerified = user.emailVerifiedAt !== null;

  const facts: AdminUserFact[] = [
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
    { label: 'Terms accepted', value: detail.termsAcceptedAt ? formatDateTime(detail.termsAcceptedAt) : 'Never' },
    { label: 'Last updated', value: formatDateTime(detail.updatedAt) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <AdminUserPanel title="Identity" description="Stored on the account record itself.">
        <AdminUserFactList facts={facts} />
      </AdminUserPanel>

      <div className="space-y-4">
        {user.lock && (
          <AdminUserPanel title="Why this account is locked">
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-rose-800">{user.lock.reason}</p>
                {user.lock.detail && <p className="mt-1 text-[12.5px] text-rose-700">{user.lock.detail}</p>}
                <p className="mt-1.5 text-[11.5px] text-rose-600">
                  {user.lock.byName} · {formatDateTime(user.lock.at)}
                </p>
              </div>
            </div>
          </AdminUserPanel>
        )}

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
  );
}
