'use client';

import { useAdminJobContentWarnings } from '@/hooks/useAdminJobs';
import { cn } from '@/lib/utils';
import type { AdminJobContentWarning } from '@/types/admin-job';
import { ShieldAlert } from 'lucide-react';

const FIELD_LABELS: Record<string, string> = {
  title: 'Title',
  description: 'Description',
  requirements: 'Requirements',
  benefits: 'Benefits',
};

export function fieldLabel(field: string): string {
  if (field.startsWith('hiringSteps')) return 'Hiring step';
  if (field.startsWith('screeningQuestions')) return 'Screening question';
  return FIELD_LABELS[field] ?? field;
}

export function rejectionReasonFor(warnings: AdminJobContentWarning[]): string {
  const terms = Array.from(new Set(warnings.flatMap((warning) => warning.terms)));
  return `The post contains terms that are not allowed: ${terms.map((term) => `"${term}"`).join(', ')}. Please remove them and submit again.`;
}

interface AdminJobContentWarningsProps {
  jobId: number;
}

export default function AdminJobContentWarnings({ jobId }: AdminJobContentWarningsProps) {
  const { data: warnings } = useAdminJobContentWarnings(jobId);

  if (!warnings || warnings.length === 0) return null;

  return (
    <div role="alert" className="space-y-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
        <ShieldAlert className="h-4 w-4" aria-hidden />
        Sensitive keywords found in {warnings.length} {warnings.length === 1 ? 'field' : 'fields'}
      </p>
      <ul className="space-y-1.5">
        {warnings.map((warning) => (
          <li key={`${warning.field}-${warning.severity}`} className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-amber-900">{fieldLabel(warning.field)}:</span>
            {warning.terms.map((term) => (
              <span
                key={term}
                className={cn(
                  'rounded-md px-1.5 py-0.5 font-bold',
                  warning.severity === 'SEVERE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-200 text-amber-900',
                )}
              >
                {term}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
