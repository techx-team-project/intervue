import type { RecruiterDashboardStat } from '@/types/recruiter';
import StatCard from './StatCard';

interface DashboardStatsRowProps {
  stats: RecruiterDashboardStat[];
}

export default function DashboardStatsRow({ stats }: DashboardStatsRowProps) {
  return (
    <section className="border-outline-variant grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-[#e9eaec] lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.kind} {...stat} />
      ))}
    </section>
  );
}
