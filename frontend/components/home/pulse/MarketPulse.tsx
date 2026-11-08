'use client';

import Skeleton from '@/components/ui/Skeleton';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { Briefcase, ShieldCheck, Sparkles, UserCheck, type LucideIcon } from 'lucide-react';

type PulseItem = { id: string; icon: LucideIcon; title: string; description: string };

const STATIC_ITEMS: PulseItem[] = [
  {
    id: 'verified',
    icon: ShieldCheck,
    title: 'Nhà tuyển dụng xác thực',
    description: 'Danh tính doanh nghiệp được kiểm tra trước khi đăng tin.',
  },
  {
    id: 'ai',
    icon: Sparkles,
    title: 'AI hỗ trợ ứng viên',
    description: 'Nhận xét CV, gợi ý việc làm và luyện phỏng vấn.',
  },
  {
    id: 'human',
    icon: UserCheck,
    title: 'Con người quyết định',
    description: 'AI không tự động nhận hay từ chối hồ sơ của bạn.',
  },
];

const ICON_TILE_CLASS =
  'bg-primary-container text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl';

export default function MarketPulse() {
  const query = usePublicJobs({ size: 1 });
  const total = query.data?.totalItems;

  return (
    <section aria-label="Điểm nổi bật của InterVue" className="container-page relative z-10 -mt-14">
      <ul className="bg-surface shadow-card expanded:grid-cols-4 medium:grid-cols-2 divide-outline-variant medium:divide-y-0 grid grid-cols-1 divide-y rounded-3xl p-3">
        <li className="flex items-center gap-4 p-5">
          <span className={ICON_TILE_CLASS}>
            <Briefcase className="h-6 w-6" aria-hidden />
          </span>
          <div>
            {query.isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="font-display text-headline-sm text-on-surface font-bold">
                {total === undefined ? '—' : total.toLocaleString('vi-VN')}
              </p>
            )}
            <p className="text-body-md text-on-surface-variant">việc làm IT đang tuyển</p>
          </div>
        </li>

        {STATIC_ITEMS.map(({ id, icon: Icon, title, description }) => (
          <li key={id} className="flex items-center gap-4 p-5">
            <span className={ICON_TILE_CLASS}>
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-title-md text-on-surface font-bold">{title}</p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
