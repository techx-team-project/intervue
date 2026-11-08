import { ROUTES } from '@/constants/routes';

export const SUPPORT_EMAIL = 'hotro@intervue.vn';
export const SUPPORT_PHONE = '0812.665.001';
export const SUPPORT_PHONE_HREF = 'tel:0812665001';

export const CANDIDATE_JOBS_MENU = [
  { href: ROUTES.JOBS, label: 'Tìm việc làm' },
  { href: ROUTES.CANDIDATE_JOB_ALERTS, label: 'Thông báo việc làm' },
];

export const CANDIDATE_CV_MENU = [
  { href: '/cv-templates', label: 'Mẫu CV' },
  { href: ROUTES.CANDIDATE_CVS, label: 'Quản lý CV' },
  { href: ROUTES.CANDIDATE_PROFILE, label: 'Hồ sơ của tôi' },
];

export const CANDIDATE_GUIDE_MENU = [
  { href: '/blog', label: 'Cẩm nang nghề nghiệp' },
  { href: '/career-orientation', label: 'Định hướng nghề nghiệp' },
];

export const RECRUITER_NAV_LINKS = [
  { href: '/recruiter#features', label: 'Giải pháp AI' },
  { href: '/recruiter#job-posting', label: 'Đăng tin tuyển dụng' },
  { href: '/recruiter#candidate-sourcing', label: 'Tìm kiếm hồ sơ' },
  { href: '/recruiter#pricing', label: 'Bảng giá dịch vụ' },
  { href: '/recruiter#testimonials', label: 'Khách hàng' },
];
