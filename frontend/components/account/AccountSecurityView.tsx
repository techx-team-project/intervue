'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import type { AuthPortal } from '@/lib/auth-portal';
import ActiveSessionsCard from './security/ActiveSessionsCard';
import DeleteAccountCard from './security/DeleteAccountCard';
import ProtectionSettingsCard from './security/ProtectionSettingsCard';
import SecurityAlertsCard from './security/SecurityAlertsCard';
import SecurityOverviewCard from './security/SecurityOverviewCard';

type AccountSecurityViewProps = { portal?: AuthPortal };

const PASSWORD_HREFS: Record<AuthPortal, string> = {
  candidate: '/account/password',
  recruiter: ROUTES.RECRUITER_ACCOUNT_PASSWORD,
};

export default function AccountSecurityView({ portal = 'candidate' }: AccountSecurityViewProps) {
  const { user } = useAuth();
  const email = user?.email ?? '';
  const emailVerified = user?.emailVerified ?? false;
  const phone = user?.phone ?? '';
  const phoneVerified = user?.phoneVerified ?? false;
  const passwordHref = PASSWORD_HREFS[portal];

  return (
    <div className="space-y-6">
      <SecurityOverviewCard
        email={email}
        emailVerified={emailVerified}
        phone={phone}
        phoneVerified={phoneVerified}
        passwordHref={passwordHref}
      />
      <ProtectionSettingsCard
        portal={portal}
        email={email}
        emailVerified={emailVerified}
        phone={phone}
        phoneVerified={phoneVerified}
        passwordHref={passwordHref}
      />
      <ActiveSessionsCard portal={portal} />
      <SecurityAlertsCard email={email} />
      <DeleteAccountCard portal={portal} />
    </div>
  );
}
