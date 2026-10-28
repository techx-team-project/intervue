import AdminDashboardView from '@/components/admin/dashboard/AdminDashboardView';
import { WORK_ITEM_KIND_LABEL } from '@/constants/admin-work';
import { fetchAdminDashboardData } from '@/mocks/admin-dashboard.mock';
import type { AdminWorkItemKind } from '@/types/admin';

export const dynamic = 'force-dynamic';

interface AdminDashboardPageProps {
  searchParams: Promise<{ queue?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const [data, params] = await Promise.all([fetchAdminDashboardData(), searchParams]);
  const requestedKind = params.queue as AdminWorkItemKind | undefined;
  const initialKind = requestedKind && requestedKind in WORK_ITEM_KIND_LABEL ? requestedKind : undefined;

  return <AdminDashboardView data={data} initialKind={initialKind} />;
}
