// TEMP: replace with API
import type { RecruiterDashboardData } from '@/types/recruiter';
import { AlertTriangle, CalendarClock, Users } from 'lucide-react';

export const MOCK_RECRUITER_DASHBOARD: RecruiterDashboardData = {
  company: {
    name: 'InterVue Technology Co., Ltd',
  },
  verification: {
    level: 'basic',
    stepsCompleted: 1,
    stepsTotal: 3,
    nextStepLabel: 'Verify your phone number',
  },
  stats: [
    {
      kind: 'activeJobPosts',
      label: 'Active job posts',
      value: 3,
      trendPercent: 12,
      trendDirection: 'up',
      sparkline: [1, 2, 2, 2, 3, 3, 3],
    },
    {
      kind: 'newApplications',
      label: 'New applications',
      value: 12,
      trendPercent: 28,
      trendDirection: 'up',
      sparkline: [3, 5, 4, 7, 6, 9, 12],
    },
    {
      kind: 'scheduledInterviews',
      label: 'Upcoming interviews',
      value: 2,
      trendPercent: 5,
      trendDirection: 'down',
      sparkline: [4, 3, 3, 2, 3, 2, 2],
    },
    {
      kind: 'creditBalance',
      label: 'Credit balance',
      value: 150,
      trendPercent: 9,
      trendDirection: 'down',
      sparkline: [200, 190, 180, 175, 165, 160, 150],
    },
  ],
  pipeline: [
    { status: 'APPLIED', label: 'Applied', count: 42 },
    { status: 'IN_REVIEW', label: 'In review', count: 18 },
    { status: 'INTERVIEW', label: 'Interview', count: 9 },
    { status: 'OFFER', label: 'Offer', count: 4 },
    { status: 'HIRED', label: 'Hired', count: 2 },
  ],
  priorities: [
    {
      id: 'priority-interviews',
      label: '2 interviews today',
      description: 'Backend Engineer · 14:00 and 16:00',
      href: '/recruiter/interviews',
      icon: CalendarClock,
    },
    {
      id: 'priority-unreviewed',
      label: '5 applications not reviewed',
      description: 'Waiting in the queue for more than 2 days',
      href: '/recruiter/applications',
      icon: Users,
    },
    {
      id: 'priority-expiring',
      label: '1 job post expiring soon',
      description: 'DevOps Engineer · expires in 3 days',
      href: '/recruiter/jobs',
      icon: AlertTriangle,
      tone: 'warning',
    },
  ],
  suggestedServices: [
    {
      id: 'svc-top-max',
      name: 'TOP MAX',
      description: 'Maximise reach with a featured slot in Highlighted jobs.',
      priceLabel: '7,500,000 VND',
      highlight: 'Best for urgent openings',
    },
    {
      id: 'svc-standard-extra',
      name: 'STANDARD EXTRA',
      description: 'Budget-friendly posting with priority placement in job search.',
      priceLabel: '2,550,000 VND',
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
