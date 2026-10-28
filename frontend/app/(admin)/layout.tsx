import RequireAuth from '@/components/auth/RequireAuth';
import { ROLES } from '@/constants/auth';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RequireAuth roles={[ROLES.ADMIN]}>{children}</RequireAuth>;
}
