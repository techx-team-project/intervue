import { buttonClassName } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import HomeSection from '../HomeSection';

const BENEFITS = [
  'Mẫu CV chuẩn ATS cho từng vị trí trong ngành IT',
  'Gợi ý nội dung từ AI, bạn luôn là người quyết định',
  'Lưu nhiều CV và chọn CV mặc định khi ứng tuyển',
];

export default function PersonalBrandSection() {
  return (
    <HomeSection titleId="personal-brand-title" className="bg-primary-light">
      <div className="medium:flex-row medium:items-center flex flex-col justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <h2 id="personal-brand-title" className="text-headline-lg text-primary font-bold">
            Cùng InterVue xây dựng hồ sơ nổi bật
          </h2>
          <ul className="space-y-2">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="text-body-lg text-on-surface-variant flex items-start gap-2">
                <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/cv-templates" className={buttonClassName({ size: 'lg', className: 'shrink-0' })}>
          Tạo CV ngay
        </Link>
      </div>
    </HomeSection>
  );
}
