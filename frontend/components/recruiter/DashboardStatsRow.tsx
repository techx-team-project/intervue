import type { RecruiterDashboardStat } from '@/types/recruiter';
import StatCard from './StatCard';

interface DashboardStatsRowProps {
  stats: RecruiterDashboardStat[];
}

export default function DashboardStatsRow({ stats }: DashboardStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.kind}
          kind={stat.kind}
          label={stat.label}
          value={stat.value}
          trendPercent={stat.trendPercent}
          trendDirection={stat.trendDirection}
          sparkline={stat.sparkline}
        />
      ))}
    </div>
  );
}
