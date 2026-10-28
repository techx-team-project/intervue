import type { AdminPlatformMetric } from '@/types/admin';

interface AdminMetricStripProps {
  metrics: AdminPlatformMetric[];
}

export default function AdminMetricStrip({ metrics }: AdminMetricStripProps) {
  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-2xl border border-[#e9eaec] bg-white shadow-xs">
      <header className="dark:border-forest-800 flex items-baseline justify-between gap-2 border-b border-[#f1f5f9] px-4 py-3">
        <h2 className="text-navy dark:text-forest-50 text-[14px] font-bold">Platform</h2>
        <span className="text-[11.5px] text-[#94a3b8]">Last 7 days</span>
      </header>

      <dl className="dark:divide-forest-800 grid grid-cols-2 divide-[#f1f5f9] sm:grid-cols-3 sm:divide-x lg:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.key} className="px-4 py-3.5">
            <dd className="text-navy dark:text-forest-50 text-xl font-black tabular-nums">{metric.value}</dd>
            <dt className="dark:text-forest-300 mt-0.5 text-[11.5px] text-[#64748b]">{metric.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
