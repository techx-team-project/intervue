import RecruiterRegisterView from '@/components/auth/RecruiterRegisterView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an employer account | InterVue AI',
  description:
    'Create a free employer account on InterVue and hire IT talent faster with AI-assisted candidate screening.',
};

export default function RecruiterRegisterPage() {
  return <RecruiterRegisterView />;
}
