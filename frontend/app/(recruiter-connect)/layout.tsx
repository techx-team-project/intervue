import RequireAuth from '@/components/auth/RequireAuth';
import { ROLES } from '@/constants/auth';
import { ReactNode } from 'react';

export default function RecruiterConnectLayout({ children }: { children: ReactNode }) {
  return <RequireAuth roles={[ROLES.RECRUITER]}>{children}</RequireAuth>;
}
