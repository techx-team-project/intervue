import { ROUTES } from '@/constants/routes';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import QuickActionCard from './QuickActionCard';

const QUICK_ACTIONS = [
  {
    title: 'Post a job',
    description: 'Create a new job post and reach the right candidates.',
    href: ROUTES.RECRUITER_JOBS_CREATE,
    icon: Plus,
  },
  {
    title: 'Search candidates',
    description: 'Proactively search candidates by skill and role.',
    href: ROUTES.RECRUITER_CANDIDATES,
    icon: Search,
  },
  {
    title: 'Buy services',
    description: 'Browse packages that make your job posts stand out.',
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
