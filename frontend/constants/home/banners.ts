import { ROUTES } from '@/constants/routes';

export type HomeBanner = {
  id: string;
  src: string;
  alt: string;
  href: string;
};

export const HOME_BANNERS: HomeBanner[] = [
  {
    id: 'jobs',
    src: '/banners/home-banner-jobs.png',
    alt: 'Đã đến lúc tìm việc IT phù hợp. Tìm việc theo công nghệ, cấp bậc và địa điểm.',
    href: ROUTES.JOBS,
  },
  {
    id: 'cv',
    src: '/banners/home-banner-cv.png',
    alt: 'Sẵn sàng ứng tuyển với CV chuẩn ATS. Mẫu CV và gợi ý từ AI, bạn luôn là người quyết định.',
    href: '/cv-templates',
  },
];
