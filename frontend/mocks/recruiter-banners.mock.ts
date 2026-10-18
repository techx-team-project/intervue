// TEMP: replace with API
import { ROUTES } from '@/constants/routes';
import type { RecruiterBannerSlide } from '@/types/recruiter';
import { Megaphone, ShieldCheck, Users } from 'lucide-react';

export const MOCK_RECRUITER_BANNERS: RecruiterBannerSlide[] = [
  {
    id: 'banner-post-job',
    eyebrow: 'Bắt đầu tuyển dụng',
    title: 'Đăng tin tuyển dụng đầu tiên của bạn',
    description: 'Tạo tin tuyển dụng với sự hỗ trợ của AI để tiếp cận đúng ứng viên IT phù hợp.',
    ctaLabel: 'Đăng tin ngay',
    href: ROUTES.RECRUITER_JOBS_CREATE,
    icon: Megaphone,
    gradientClassName: 'bg-linear-to-br from-[#0c2e24] via-[#103a2e] to-primary',
  },
  {
    id: 'banner-ai-screening',
    eyebrow: 'AI hỗ trợ',
    title: 'AI hỗ trợ sàng lọc hồ sơ ứng viên',
    description: 'Xem đánh giá mức độ phù hợp của từng hồ sơ ứng tuyển trước khi phỏng vấn.',
    ctaLabel: 'Xem hồ sơ ứng tuyển',
    href: ROUTES.RECRUITER_APPLICATIONS,
    icon: Users,
    gradientClassName: 'bg-linear-to-br from-[#0f2a4a] via-[#163a63] to-[#1e63b8]',
  },
  {
    id: 'banner-verification',
    eyebrow: 'Xác thực doanh nghiệp',
    title: 'Hoàn tất xác thực để tăng độ tin cậy',
    description: 'Doanh nghiệp đã xác thực sẽ được ưu tiên hiển thị và dễ tiếp cận ứng viên hơn.',
    ctaLabel: 'Xác thực ngay',
    href: ROUTES.RECRUITER_COMPANY_VERIFICATION,
    icon: ShieldCheck,
    gradientClassName: 'bg-linear-to-br from-[#4a2c0f] via-[#6b3f14] to-amber-600',
  },
];
