'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import type { RecruiterPipelineStage } from '@/types/recruiter';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PipelineFunnelCardProps {
  stages: RecruiterPipelineStage[];
}

export default function PipelineFunnelCard({ stages }: PipelineFunnelCardProps) {
  const { user } = useAuth();
  const maxCount = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {user?.name && (
            <p className="text-[12.5px] text-[#64748b]">Hi {user.name}, here is how your hiring is going</p>
          )}
          <h2 className="text-navy mt-0.5 text-[17px] font-black">Hiring funnel</h2>
        </div>

        <Link
          href={ROUTES.RECRUITER_APPLICATIONS}
          className="text-primary inline-flex items-center gap-1 text-[12.5px] font-bold hover:underline"
        >
          <span>View details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 flex flex-1 items-center">
        <div className="flex w-full items-stretch">
          {stages.map((stage, index) => {
            const isLast = index === stages.length - 1;
            const widthPercent = Math.max((stage.count / maxCount) * 100, 14);

            return (
              <div key={stage.status} className="flex flex-1 items-stretch">
                <div className="flex min-w-0 flex-1 flex-col" style={{ flexBasis: `${widthPercent}%` }}>
                  <div
                    className={`flex min-h-24 flex-col justify-center rounded-xl px-4 py-3 transition ${
                      isLast ? 'bg-primary text-white' : 'bg-primary/10 text-navy'
                    }`}
                  >
                    <span className={`text-[11px] font-semibold ${isLast ? 'text-white/80' : 'text-[#64748b]'}`}>
                      {stage.label}
                    </span>
                    <span className="mt-1 text-2xl font-black">{stage.count}</span>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex shrink-0 items-center px-1.5">
                    <ChevronRight className="h-4 w-4 text-[#cbd5e1]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
