import RequireAuth from '@/components/auth/RequireAuth';
import RecruiterShell from '@/components/recruiter/RecruiterShell';
import { ROLES } from '@/constants/auth';
import { ReactNode } from 'react';

export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth roles={[ROLES.RECRUITER]}>
      <RecruiterShell>{children}</RecruiterShell>
    </RequireAuth>
  );
}
