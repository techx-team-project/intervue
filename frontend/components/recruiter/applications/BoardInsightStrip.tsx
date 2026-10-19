import Sparkline from '@/components/ui/Sparkline';
import { cn } from '@/lib/utils';
import type { RecruiterApplication } from '@/types/recruiter-application';
import { dayDifferenceFromToday } from '@/utils/datetime';
import { CalendarClock, Clock3, Inbox, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BoardInsightStripProps {
  applications: RecruiterApplication[];
}

const STALE_APPLIED_DAYS = 3;
const TREND_DAYS = 7;

interface InsightTile {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  toneClassName: string;
}

export default function BoardInsightStrip({ applications }: BoardInsightStripProps) {
  const unviewedCount = applications.filter((application) => !application.isViewed).length;

  const waitingTooLongCount = applications.filter(
    (application) =>
      application.status === 'APPLIED' && dayDifferenceFromToday(application.appliedAt) <= -STALE_APPLIED_DAYS,
  ).length;

  const upcomingInterviewCount = applications.filter(
    (application) => application.interview && dayDifferenceFromToday(application.interview.scheduledAt) >= 0,
  ).length;

  const trend = Array.from({ length: TREND_DAYS }, (_, index) => {
    const offset = -(TREND_DAYS - 1 - index);
    return applications.filter((application) => dayDifferenceFromToday(application.appliedAt) === offset).length;
  });

  const tiles: InsightTile[] = [
    {
      label: 'Hồ sơ đang hiển thị',
      value: applications.length,
      hint: 'Theo bộ lọc hiện tại',
      icon: Users,
      toneClassName: 'text-sky-600 bg-sky-50',
    },
    {
      label: 'Chưa xem',
      value: unviewedCount,
      hint: 'Cần mở xem lần đầu',
      icon: Inbox,
      toneClassName: 'text-primary bg-emerald-50',
    },
    {
      label: `Chờ quá ${STALE_APPLIED_DAYS} ngày`,
      value: waitingTooLongCount,
      hint: 'Vẫn ở cột Hồ sơ mới',
      icon: Clock3,
      toneClassName: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Phỏng vấn sắp tới',
      value: upcomingInterviewCount,
      hint: 'Đã có lịch hẹn',
      icon: CalendarClock,
      toneClassName: 'text-violet-600 bg-violet-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <div key={tile.label} className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11.5px] font-bold text-[#64748b]">{tile.label}</p>
              <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', tile.toneClassName)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="text-navy mt-1.5 text-2xl font-black">{tile.value}</p>
            <p className="text-[11px] text-[#94a3b8]">{tile.hint}</p>
          </div>
        );
      })}

      <div className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5 shadow-xs">
        <p className="text-[11.5px] font-bold text-[#64748b]">Hồ sơ nhận theo ngày</p>
        <div className="mt-2">
          <Sparkline values={trend} />
        </div>
        <p className="mt-1 text-[11px] text-[#94a3b8]">{TREND_DAYS} ngày gần nhất</p>
      </div>
    </div>
  );
}
