import { Metadata } from 'next';
import AccountOverviewView from '@/components/account/AccountOverviewView';

export const metadata: Metadata = {
  title: 'Job search settings & account overview | InterVue',
  description: 'Manage your job search status, let recruiters find your profile and track CV interest.',
};

export default function AccountPage() {
  return <AccountOverviewView />;
}
