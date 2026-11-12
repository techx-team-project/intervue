import { ROUTES } from '@/constants/routes';
import type { RecruiterPipelineStage } from '@/types/recruiter';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PipelineFunnelCardProps {
  stages: RecruiterPipelineStage[];
}

export default function PipelineFunnelCard({ stages }: PipelineFunnelCardProps) {
  const maxCount = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <section className="border-outline-variant flex h-full flex-col rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-navy text-body-lg font-bold">Phễu tuyển dụng</h2>
        <Link
          href={ROUTES.RECRUITER_APPLICATIONS}
          className="text-primary text-body-sm inline-flex items-center gap-1 font-semibold hover:underline"
        >
          Xem chi tiết
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ol className="mt-6 flex flex-1 flex-col justify-between gap-4">
        {stages.map((stage, index) => {
          const previous = index > 0 ? stages[index - 1].count : 0;
          const conversion = previous > 0 ? Math.round((stage.count / previous) * 100) : null;

          return (
            <li key={stage.status} className="grid grid-cols-[84px_1fr_auto] items-center gap-4">
              <span className="text-body-sm text-on-surface-variant font-medium">{stage.label}</span>
              <div className="bg-surface-container-low h-2.5 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${Math.max((stage.count / maxCount) * 100, 3)}%` }}
                />
              </div>
              <span className="flex w-20 items-baseline justify-end gap-2 tabular-nums">
                <span className="text-navy text-body-md font-bold">{stage.count}</span>
                <span className="text-label-sm text-outline w-8 text-right">
                  {conversion !== null ? `${conversion}%` : ''}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
