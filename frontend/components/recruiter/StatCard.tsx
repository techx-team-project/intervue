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
    <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="text-primary flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Icon className="h-5 w-5" />
        </div>

        {trendPercent !== undefined && (
          <span
            className={`text-label-sm inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
              trendDirection === 'down' ? 'bg-rose-50 text-rose-600' : 'text-primary bg-emerald-50'
            }`}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{trendPercent}%</span>
          </span>
        )}
      </div>

      <p className="text-navy mt-3 text-2xl font-bold">{value}</p>
      <p className="text-body-sm text-on-surface-variant mt-0.5">{label}</p>

      {sparkline && sparkline.length > 0 && <Sparkline values={sparkline} className="mt-3" />}
    </div>
  );
}
