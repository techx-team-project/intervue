import { ACTIVITY_ICON, ACTIVITY_TONE } from '@/constants/admin-user';
import { cn } from '@/lib/utils';
import type { AdminUserActivityEntry } from '@/types/admin-user';
import { formatDateTime } from '@/utils/datetime';
import { History } from 'lucide-react';
import AdminUserPanel from './AdminUserPanel';

interface AdminUserActivityTabProps {
  activity: AdminUserActivityEntry[];
}

export default function AdminUserActivityTab({ activity }: AdminUserActivityTabProps) {
  return (
    <AdminUserPanel
      title="Activity history"
      description="Account events and every admin action taken on this account, newest first."
    >
      {activity.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <History className="text-outline h-7 w-7" />
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">Nothing recorded yet</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {activity.map((entry) => {
            const Icon = ACTIVITY_ICON[entry.kind];

            return (
              <li key={entry.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    ACTIVITY_TONE[entry.kind],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-navy dark:text-forest-50 text-body-md font-semibold">{entry.summary}</p>

                  {entry.reason && (
                    <p className="dark:text-forest-300 text-body-sm text-on-surface-variant mt-0.5">
                      Reason: {entry.reason}
                    </p>
                  )}

                  <p className="text-label-sm text-outline mt-0.5">
                    {entry.actorName ? `${entry.actorName} · ` : ''}
                    {formatDateTime(entry.at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </AdminUserPanel>
  );
}
