import { Sparkline } from '@/components/ui/Sparkline';
import type { RecruiterDashboardStat } from '@/types/recruiter';
import { TrendingDown, TrendingUp } from 'lucide-react';

const numberFormatter = new Intl.NumberFormat('vi-VN');

export default function StatCard({ label, value, trendPercent, trendDirection, sparkline }: RecruiterDashboardStat) {
  const isDown = trendDirection === 'down';
  const TrendIcon = isDown ? TrendingDown : TrendingUp;

  return (
    <div className="bg-white p-5 sm:p-6">
      <p className="text-body-sm text-on-surface-variant font-medium">{label}</p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-navy text-3xl font-bold tracking-tight tabular-nums">{numberFormatter.format(value)}</p>
        {sparkline && sparkline.length > 0 && <Sparkline values={sparkline} className="h-7 w-16 shrink-0" />}
      </div>

      {trendPercent !== undefined && (
        <p
          className={`text-label-sm mt-2 inline-flex items-center gap-1 font-semibold ${
            isDown ? 'text-rose-600' : 'text-primary'
          }`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {trendPercent}% so với tuần trước
        </p>
      )}
    </div>
  );
}
