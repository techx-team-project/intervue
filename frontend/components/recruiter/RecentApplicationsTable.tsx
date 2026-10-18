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
  APPLIED: { label: 'Mới ứng tuyển', variant: 'info' },
  IN_REVIEW: { label: 'Đang xem xét', variant: 'warning' },
  INTERVIEW: { label: 'Phỏng vấn', variant: 'info' },
  OFFER: { label: 'Đề nghị offer', variant: 'success' },
  HIRED: { label: 'Đã tuyển', variant: 'success' },
  REJECTED: { label: 'Từ chối', variant: 'danger' },
  WITHDRAWN: { label: 'Đã rút hồ sơ', variant: 'default' },
  NO_AGREEMENT: { label: 'Không thỏa thuận', variant: 'default' },
};

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export default function RecentApplicationsTable({ applications }: RecentApplicationsTableProps) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-navy text-[16px] font-bold">Hồ sơ ứng tuyển gần đây</h2>
        <Link href={ROUTES.RECRUITER_APPLICATIONS} className="text-primary text-[12.5px] font-bold hover:underline">
          Xem tất cả
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="mt-4 text-[13px] text-[#64748b]">Chưa có hồ sơ ứng tuyển nào.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-150">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 border-b border-[#f1f5f9] px-2.5 pb-2.5 text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">
              <span>Ứng viên</span>
              <span>Vị trí</span>
              <span>Trạng thái</span>
              <span className="text-right">Ngày nộp</span>
            </div>

            <div className="divide-y divide-[#f1f5f9]">
              {applications.map((application) => {
                const status = STATUS_META[application.status];

                return (
                  <div
                    key={application.id}
                    className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 rounded-lg px-2.5 py-3 transition hover:bg-[#f8fafc]"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 to-teal-600 text-[12px] font-black text-white">
                        {application.candidateName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-navy truncate text-[13px] font-bold">{application.candidateName}</span>
                    </div>

                    <span className="truncate text-[12.5px] text-[#64748b]">{application.jobTitle}</span>

                    <span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </span>

                    <span className="text-right text-[11.5px] text-[#94a3b8]">
                      {dateFormatter.format(new Date(application.appliedAt))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
