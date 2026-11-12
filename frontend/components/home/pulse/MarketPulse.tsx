'use client';

import Skeleton from '@/components/ui/Skeleton';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { Briefcase, ShieldCheck, Sparkles, UserCheck, type LucideIcon } from 'lucide-react';

type PulseItem = { id: string; icon: LucideIcon; label: string; title: string; description: string };

const STATIC_ITEMS: PulseItem[] = [
  {
    id: 'verified',
    icon: ShieldCheck,
    label: 'Trust',
    title: 'Verified recruiters',
    description: 'Company identity is checked before posting.',
  },
  {
    id: 'ai',
    icon: Sparkles,
    label: 'For candidates',
    title: 'AI on your side',
    description: 'CV feedback, job suggestions and interview practice.',
  },
  {
    id: 'human',
    icon: UserCheck,
    label: 'Fair by design',
    title: 'Humans decide',
    description: 'AI never automatically accepts or rejects your application.',
  },
];

const CELL_CLASS = 'flex flex-col gap-4 p-6 lg:p-7';
const LABEL_CLASS =
  'text-label-md text-on-surface-variant flex items-center justify-between font-bold tracking-widest uppercase';

export default function MarketPulse() {
  const query = usePublicJobs({ size: 1 });
  const total = query.data?.totalItems;

  return (
    <section aria-label="InterVue highlights" className="container-page relative z-10 -mt-20">
      <ul className="bg-surface-container-low shadow-float border-outline-variant expanded:grid-cols-4 medium:grid-cols-2 divide-outline-variant medium:divide-y-0 expanded:divide-x grid grid-cols-1 divide-y overflow-hidden rounded-[28px] border">
        <li className={CELL_CLASS}>
          <p className={LABEL_CLASS}>
            Open now
            <Briefcase className="h-4 w-4" aria-hidden />
          </p>
          <div>
            {query.isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <p className="font-display text-on-surface text-4xl leading-none font-extrabold tracking-tight tabular-nums">
                {total === undefined ? '—' : total.toLocaleString('en-US')}
              </p>
            )}
            <p className="text-body-md text-on-surface-variant mt-2">IT jobs from verified companies</p>
          </div>
        </li>

        {STATIC_ITEMS.map(({ id, icon: Icon, label, title, description }) => (
          <li key={id} className={CELL_CLASS}>
            <p className={LABEL_CLASS}>
              {label}
              <Icon className="h-4 w-4" aria-hidden />
            </p>
            <div>
              <p className="font-display text-on-surface text-title-md font-bold">{title}</p>
              <p className="text-body-md text-on-surface-variant mt-2">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
