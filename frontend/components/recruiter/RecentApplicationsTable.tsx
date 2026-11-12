import Badge from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import type { RecentApplicationPreview, RecentApplicationStatus } from '@/types/recruiter';
import Link from 'next/link';

interface RecentApplicationsTableProps {
  applications: RecentApplicationPreview[];
}

const STATUS_META: Record<
  RecentApplicationStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  APPLIED: { label: 'Mới', variant: 'info' },
  IN_REVIEW: { label: 'Đang xem xét', variant: 'warning' },
  INTERVIEW: { label: 'Phỏng vấn', variant: 'info' },
  OFFER: { label: 'Đã gửi offer', variant: 'success' },
  HIRED: { label: 'Đã tuyển', variant: 'success' },
  REJECTED: { label: 'Từ chối', variant: 'danger' },
  WITHDRAWN: { label: 'Đã rút', variant: 'default' },
  NO_AGREEMENT: { label: 'Không thống nhất', variant: 'default' },
};

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export default function RecentApplicationsTable({ applications }: RecentApplicationsTableProps) {
  return (
    <section className="border-outline-variant rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-navy text-body-lg font-bold">Hồ sơ mới nhất</h2>
        <Link href={ROUTES.RECRUITER_APPLICATIONS} className="text-primary text-body-sm font-semibold hover:underline">
          Xem tất cả
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="text-body-md text-on-surface-variant mt-4">Chưa có hồ sơ ứng tuyển nào.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-150">
            <div className="border-outline-variant text-label-sm text-outline grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 border-b px-2.5 pb-2.5 font-semibold tracking-wide uppercase">
              <span>Ứng viên</span>
              <span>Vị trí</span>
              <span>Trạng thái</span>
              <span className="text-right">Nộp lúc</span>
            </div>

            <div className="divide-y divide-[#f1f5f9]">
              {applications.map((application) => {
                const status = STATUS_META[application.status];

                return (
                  <div
                    key={application.id}
                    className="hover:bg-surface-container-low grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 rounded-lg px-2.5 py-3 transition"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="text-body-sm bg-surface-container-high text-navy flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                        {application.candidateName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-navy text-body-md truncate font-bold">{application.candidateName}</span>
                    </div>

                    <span className="text-body-sm text-on-surface-variant truncate">{application.jobTitle}</span>

                    <span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </span>

                    <span className="text-label-sm text-outline text-right">
                      {dateFormatter.format(new Date(application.appliedAt))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
