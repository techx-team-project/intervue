// TEMP: replace with API
import type { RecruiterDashboardData } from '@/types/recruiter';
import { AlertTriangle, CalendarClock, Users } from 'lucide-react';

export const MOCK_RECRUITER_DASHBOARD: RecruiterDashboardData = {
  company: {
    name: 'Công ty TNHH Công nghệ InterVue',
  },
  verification: {
    level: 'basic',
    stepsCompleted: 1,
    stepsTotal: 3,
    nextStepLabel: 'Xác thực số điện thoại',
  },
  stats: [
    {
      kind: 'activeJobPosts',
      label: 'Tin tuyển dụng đang chạy',
      value: 3,
      trendPercent: 12,
      trendDirection: 'up',
      sparkline: [1, 2, 2, 2, 3, 3, 3],
    },
    {
      kind: 'newApplications',
      label: 'Hồ sơ ứng tuyển mới',
      value: 12,
      trendPercent: 28,
      trendDirection: 'up',
      sparkline: [3, 5, 4, 7, 6, 9, 12],
    },
    {
      kind: 'scheduledInterviews',
      label: 'Lịch phỏng vấn sắp tới',
      value: 2,
      trendPercent: 5,
      trendDirection: 'down',
      sparkline: [4, 3, 3, 2, 3, 2, 2],
    },
    {
      kind: 'creditBalance',
      label: 'Số dư credit',
      value: 150,
      trendPercent: 9,
      trendDirection: 'down',
      sparkline: [200, 190, 180, 175, 165, 160, 150],
    },
  ],
  pipeline: [
    { status: 'APPLIED', label: 'Ứng tuyển', count: 42 },
    { status: 'IN_REVIEW', label: 'Đang xem xét', count: 18 },
    { status: 'INTERVIEW', label: 'Phỏng vấn', count: 9 },
    { status: 'OFFER', label: 'Đề nghị offer', count: 4 },
    { status: 'HIRED', label: 'Đã tuyển', count: 2 },
  ],
  priorities: [
    {
      id: 'priority-interviews',
      label: '2 cuộc phỏng vấn hôm nay',
      description: 'Backend Engineer · 14:00 và 16:00',
      href: '/recruiter/interviews',
      icon: CalendarClock,
    },
    {
      id: 'priority-unreviewed',
      label: '5 hồ sơ chưa xem',
      description: 'Đã nằm trong hàng chờ hơn 2 ngày',
      href: '/recruiter/applications',
      icon: Users,
    },
    {
      id: 'priority-expiring',
      label: '1 tin sắp hết hạn',
      description: 'DevOps Engineer · hết hạn trong 3 ngày',
      href: '/recruiter/jobs',
      icon: AlertTriangle,
      tone: 'warning',
    },
  ],
  suggestedServices: [
    {
      id: 'svc-top-max',
      name: 'TOP MAX',
      description: 'Đăng tin hiệu quả với vị trí nổi bật trong Việc làm nổi bật.',
      priceLabel: '7.500.000đ',
      highlight: 'Phù hợp với tin đang tuyển gấp',
    },
    {
      id: 'svc-standard-extra',
      name: 'STANDARD EXTRA',
      description: 'Đăng tin tiết kiệm với vị trí ưu tiên trên danh sách tìm việc.',
      priceLabel: '2.550.000đ',
    },
  ],
  recentApplications: [
    {
      id: 'app-1021',
      candidateName: 'Trần Minh Khang',
      jobTitle: 'Backend Engineer (Java/Spring)',
      status: 'IN_REVIEW',
      appliedAt: '2026-10-18T09:12:00Z',
    },
    {
      id: 'app-1020',
      candidateName: 'Lê Thị Hồng Nhung',
      jobTitle: 'Frontend Engineer (React/Next.js)',
      status: 'APPLIED',
      appliedAt: '2026-10-18T03:40:00Z',
    },
    {
      id: 'app-1019',
      candidateName: 'Phạm Quốc Bảo',
      jobTitle: 'Backend Engineer (Java/Spring)',
      status: 'INTERVIEW',
      appliedAt: '2026-10-17T14:05:00Z',
    },
    {
      id: 'app-1018',
      candidateName: 'Nguyễn Thị Thu Hà',
      jobTitle: 'DevOps Engineer',
      status: 'OFFER',
      appliedAt: '2026-10-16T08:21:00Z',
    },
    {
      id: 'app-1017',
      candidateName: 'Đỗ Anh Tuấn',
      jobTitle: 'Frontend Engineer (React/Next.js)',
      status: 'REJECTED',
      appliedAt: '2026-10-15T11:47:00Z',
    },
  ],
};
