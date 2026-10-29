'use client';

import { useAdminTriage } from '@/hooks/useAdminTriage';
import { useAuth } from '@/hooks/useAuth';
import type { AdminDashboardData, AdminWorkItemKind } from '@/types/admin';
import AdminAuditFeed from './AdminAuditFeed';
import AdminBannerCarousel from './AdminBannerCarousel';
import AdminHighlightRow from './AdminHighlightRow';
import AdminMascotCard from './AdminMascotCard';
import AdminMetricStrip from './AdminMetricStrip';
import AdminQueueBreakdown from './AdminQueueBreakdown';
import AdminRejectDialog from './AdminRejectDialog';
import AdminWorklist from './AdminWorklist';

interface AdminDashboardViewProps {
  data: AdminDashboardData;
  initialKind?: AdminWorkItemKind;
}

export default function AdminDashboardView({ data, initialKind }: AdminDashboardViewProps) {
  const { user } = useAuth();
  const { items, approve, rejectTarget, requestReject, closeReject, confirmReject } = useAdminTriage(data.workItems);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="dark:text-forest-300 text-[13.5px] text-[#64748b]">
          Hi <span className="text-navy dark:text-forest-50 font-bold">{user?.name}</span>, here is what needs you
          today.
        </p>
        <p className="text-[12px] text-[#94a3b8]">
          {new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Ho_Chi_Minh',
          }).format(new Date())}
        </p>
      </div>

      <AdminBannerCarousel slides={data.banners} />

      <AdminHighlightRow highlights={data.highlights} />

      <AdminQueueBreakdown queues={data.queues} />

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminWorklist items={items} initialKind={initialKind} onApprove={approve} onReject={requestReject} />
        </div>

        <div className="min-h-0">
          <AdminAuditFeed entries={data.recentAudit} />
        </div>
      </div>

      <AdminMascotCard />

      <AdminMetricStrip metrics={data.metrics} />

      {rejectTarget && <AdminRejectDialog item={rejectTarget} onClose={closeReject} onConfirm={confirmReject} />}
    </div>
  );
}
