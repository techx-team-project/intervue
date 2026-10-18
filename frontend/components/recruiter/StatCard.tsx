import { Sparkline } from '@/components/ui/Sparkline';
import type { DashboardStatKind } from '@/types/recruiter';
import { Briefcase, CalendarClock, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  kind: DashboardStatKind;
  trendPercent?: number;
  trendDirection?: 'up' | 'down';
  sparkline?: number[];
}

const STAT_ICON: Record<DashboardStatKind, LucideIcon> = {
  activeJobPosts: Briefcase,
  newApplications: Users,
  scheduledInterviews: CalendarClock,
  creditBalance: Wallet,
};

export default function StatCard({ label, value, kind, trendPercent, trendDirection, sparkline }: StatCardProps) {
  const Icon = STAT_ICON[kind];
  const TrendIcon = trendDirection === 'down' ? TrendingDown : TrendingUp;

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="text-primary flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Icon className="h-5 w-5" />
        </div>

        {trendPercent !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              trendDirection === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-[#00873c]'
            }`}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{trendPercent}%</span>
          </span>
        )}
      </div>

      <p className="text-navy mt-3 text-2xl font-black">{value}</p>
      <p className="mt-0.5 text-[12.5px] text-[#64748b]">{label}</p>

      {sparkline && sparkline.length > 0 && <Sparkline values={sparkline} className="mt-3" />}
    </div>
  );
}
