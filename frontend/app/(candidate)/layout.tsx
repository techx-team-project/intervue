import RequireAuth from '@/components/auth/RequireAuth';
import { ROLES } from '@/constants/auth';
import { ReactNode } from 'react';

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return <RequireAuth roles={[ROLES.CANDIDATE]}>{children}</RequireAuth>;
}
