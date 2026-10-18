import { ROUTES } from '@/constants/routes';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import QuickActionCard from './QuickActionCard';

const QUICK_ACTIONS = [
  {
    title: 'Đăng tin tuyển dụng',
    description: 'Tạo tin tuyển dụng mới và tiếp cận ứng viên phù hợp.',
    href: ROUTES.RECRUITER_JOBS_CREATE,
    icon: Plus,
  },
  {
    title: 'Tìm hồ sơ ứng viên',
    description: 'Chủ động tìm kiếm ứng viên theo kỹ năng, vị trí.',
    href: ROUTES.RECRUITER_CANDIDATES,
    icon: Search,
  },
  {
    title: 'Mua dịch vụ',
    description: 'Xem các gói dịch vụ giúp tin tuyển dụng nổi bật hơn.',
    href: ROUTES.RECRUITER_SERVICES,
    icon: ShoppingBag,
  },
];

export default function QuickActionsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {QUICK_ACTIONS.map((action) => (
        <QuickActionCard key={action.href} {...action} />
      ))}
    </div>
  );
}
